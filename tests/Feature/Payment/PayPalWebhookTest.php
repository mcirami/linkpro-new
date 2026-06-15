<?php

use App\Services\PayPalService;

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
