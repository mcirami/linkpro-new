<?php

use App\Models\Subscription;
use App\Models\User;
use App\Notifications\NotifyAboutPaymentFailed;
use App\Services\PayPalService;
use Illuminate\Support\Facades\Notification;

/**
 * Make PayPal signature verification pass for the lifecycle tests below.
 */
function fakeVerifiedPayPal(): void
{
    test()->mock(PayPalService::class, function ($mock) {
        $mock->shouldReceive('verifyWebhookSignature')->andReturnTrue();
    });
}

test('a paypal webhook with an invalid signature is rejected with 400', function () {
    $this->mock(PayPalService::class, function ($mock) {
        $mock->shouldReceive('verifyWebhookSignature')->once()->andReturnFalse();
    });

    $this->postJson('/paypal-webhook', [
        'event_type' => 'BILLING.SUBSCRIPTION.CANCELLED',
        'resource'   => ['id' => 'I-SUB123', 'start_time' => '2026-01-01T00:00:00Z'],
    ])->assertStatus(400);
});

test('a paypal webhook with a valid signature is accepted', function () {
    $this->mock(PayPalService::class, function ($mock) {
        $mock->shouldReceive('verifyWebhookSignature')->once()->andReturnTrue();
    });

    // Unknown subscription id -> the handler no-ops, but should still 200.
    $this->postJson('/paypal-webhook', [
        'event_type' => 'BILLING.SUBSCRIPTION.CANCELLED',
        'resource'   => ['id' => 'I-DOES-NOT-EXIST', 'start_time' => '2026-01-01T00:00:00Z'],
    ])->assertStatus(200);
});

test('an unconfigured webhook id causes verification to fail closed', function () {
    // No mock: exercise the real verifier with empty config -> must reject.
    config(['paypal.sandbox.webhook_id' => '']);

    $this->postJson('/paypal-webhook', [
        'event_type' => 'BILLING.SUBSCRIPTION.CANCELLED',
        'resource'   => ['id' => 'I-SUB123'],
    ])->assertStatus(400);
});

test('a failed payment flags the subscription past_due and notifies, keeping access', function () {
    Notification::fake();
    fakeVerifiedPayPal();

    $user = User::factory()->create();
    $subscription = Subscription::create([
        'user_id' => $user->id,
        'name'    => 'pro',
        'sub_id'  => 'I-PASTDUE',
        'status'  => 'active',
    ]);

    $this->postJson('/paypal-webhook', [
        'id'         => 'WH-FAILED-1',
        'event_type' => 'BILLING.SUBSCRIPTION.PAYMENT.FAILED',
        'resource'   => ['id' => 'I-PASTDUE', 'plan_id' => 'P-5XM03253A6686724NMYGYLEQ'],
    ])->assertStatus(200);

    $subscription->refresh();
    expect($subscription->status)->toBe('past_due')
        ->and($subscription->name)->toBe('pro')        // not downgraded
        ->and($subscription->sub_id)->toBe('I-PASTDUE') // access preserved
        ->and($subscription->downgraded)->toBeFalsy();

    Notification::assertSentTo($user, NotifyAboutPaymentFailed::class);
});

test('a suspended subscription is downgraded to free and the user is notified', function () {
    Notification::fake();
    fakeVerifiedPayPal();

    $user = User::factory()->create();
    $subscription = Subscription::create([
        'user_id' => $user->id,
        'name'    => 'pro',
        'sub_id'  => 'I-SUSPEND',
        'status'  => 'active',
    ]);

    $this->postJson('/paypal-webhook', [
        'id'         => 'WH-SUSPEND-1',
        'event_type' => 'BILLING.SUBSCRIPTION.SUSPENDED',
        'resource'   => ['id' => 'I-SUSPEND', 'plan_id' => 'P-5XM03253A6686724NMYGYLEQ'],
    ])->assertStatus(200);

    $subscription->refresh();
    expect($subscription->name)->toBe('free')
        ->and($subscription->sub_id)->toBeNull()
        ->and((bool) $subscription->downgraded)->toBeTrue();

    Notification::assertSentTo($user, NotifyAboutPaymentFailed::class);
});
