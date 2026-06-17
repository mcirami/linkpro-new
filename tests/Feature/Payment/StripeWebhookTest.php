<?php

use App\Services\WebhookService;
use Illuminate\Testing\TestResponse;

const STRIPE_TEST_SECRET = 'whsec_test_secret';

beforeEach(function () {
    // Test env is non-production, so the controller uses the *test* secret.
    config(['services.stripe.test_webhook_secret' => STRIPE_TEST_SECRET]);
});

/**
 * Build a Stripe-Signature header for the given raw payload.
 */
function stripeSignature(string $payload, string $secret = STRIPE_TEST_SECRET): string
{
    $timestamp = time();
    $signature = hash_hmac('sha256', "{$timestamp}.{$payload}", $secret);

    return "t={$timestamp},v1={$signature}";
}

/**
 * POST a signed Stripe event to the customer webhook endpoint.
 */
function postStripeWebhook(array $payload, ?string $signature = null): TestResponse
{
    $json = json_encode($payload);

    return test()->call('POST', '/stripe-webhook', [], [], [], [
        'HTTP_STRIPE_SIGNATURE' => $signature ?? stripeSignature($json),
        'CONTENT_TYPE'          => 'application/json',
    ], $json);
}

function subscriptionUpdatedEvent(string $eventId = 'evt_su_1'): array
{
    return [
        'id'   => $eventId,
        'type' => 'customer.subscription.updated',
        'data' => ['object' => [
            'id'        => 'sub_1',
            'cancel_at' => null,
            'plan'      => ['product' => 'prod_1'],
        ]],
    ];
}

test('a webhook with an invalid signature is rejected with 400', function () {
    postStripeWebhook(
        ['id' => 'evt_x', 'type' => 'customer.updated', 'data' => ['object' => []]],
        't=123,v1=deadbeef'
    )->assertStatus(400);

    $this->assertDatabaseCount('processed_webhook_events', 0);
});

test('a valid event is processed and recorded', function () {
    $payload = [
        'id'   => 'evt_cu_1',
        'type' => 'customer.updated',
        'data' => ['object' => ['id' => 'cus_1', 'invoice_settings' => ['default_payment_method' => null]]],
    ];

    postStripeWebhook($payload)->assertStatus(200);

    $this->assertDatabaseHas('processed_webhook_events', [
        'provider' => 'stripe',
        'event_id' => 'evt_cu_1',
        'type'     => 'customer.updated',
    ]);
});

test('a redelivered event is not processed twice', function () {
    // The handler should run exactly once across two identical deliveries.
    $this->mock(WebhookService::class, function ($mock) {
        $mock->shouldReceive('updateSubscription')->once()->with('sub_1', 'prod_1');
    });

    postStripeWebhook(subscriptionUpdatedEvent())->assertStatus(200);
    postStripeWebhook(subscriptionUpdatedEvent())->assertStatus(200); // duplicate

    $this->assertDatabaseCount('processed_webhook_events', 1);
});

test('a failed handler releases the claim so the event can be retried', function () {
    $this->mock(WebhookService::class, function ($mock) {
        $mock->shouldReceive('updateSubscription')->andThrow(new RuntimeException('transient failure'));
    });

    postStripeWebhook(subscriptionUpdatedEvent())->assertStatus(500);

    // Claim was rolled back, so a Stripe retry would reprocess.
    $this->assertDatabaseCount('processed_webhook_events', 0);
});
