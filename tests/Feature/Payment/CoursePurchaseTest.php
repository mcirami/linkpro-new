<?php

use App\Events\PurchasedItem;
use App\Models\Offer;
use App\Models\OfferClick;
use App\Models\Purchase;
use App\Models\User;
use App\Services\PayPalService;
use App\Services\PurchaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // PurchaseService instantiates a Stripe client in its constructor; give it
    // a dummy key so construction never touches a real gateway.
    config(['services.stripe.sandbox_secret' => 'sk_test_dummy']);
    Role::findOrCreate('course.user', 'web');
});

/**
 * Build the GET request the success route receives.
 */
function purchaseRequest(array $params): Request
{
    return Request::create('/purchase/success', 'GET', $params);
}

/**
 * A PurchaseService whose Stripe session lookup is stubbed with the given data.
 */
function stripePurchaseService(array $billing): PurchaseService
{
    $service = Mockery::mock(PurchaseService::class)->makePartial();
    $service->shouldReceive('getCustomerBillingInfo')->andReturn($billing);

    return $service;
}

// ---------------------------------------------------------------------------
// Stripe
// ---------------------------------------------------------------------------

test('a paid stripe session that matches the offer records the purchase', function () {
    Event::fake([PurchasedItem::class]);

    $user = User::factory()->create();
    $this->actingAs($user);
    $offer = Offer::factory()->create(['price' => 100]);
    $click = OfferClick::factory()->create(['offer_id' => $offer->id]);

    $service = stripePurchaseService([
        'id'              => 'cus_123',
        'name'            => 'Jane Buyer',
        'last4'           => '4242',
        'pmType'          => 'card',
        'paymentStatus'   => 'paid',
        'amountTotal'     => 12345, // cents -> 123.45
        'sessionId'       => 'cs_test_paid',
        'clientReference' => (string) $offer->id,
    ]);

    $result = $service->savePurchase($offer, purchaseRequest([
        'pmType' => 'stripe', 'session_id' => 'cs_test_paid',
        'cid' => $click->id, 'offer' => $offer->id,
    ]));

    expect($result['success'])->toBeTrue();

    $this->assertDatabaseHas('purchases', [
        'transaction_id'  => 'cs_test_paid',
        'purchase_amount' => 123.45,
        'user_id'         => $user->id,
        'pm_type'         => 'card',
    ]);

    expect($user->fresh()->hasRole('course.user'))->toBeTrue();
    Event::assertDispatched(PurchasedItem::class);
});

test('the recorded amount comes from stripe, never the client', function () {
    Event::fake([PurchasedItem::class]);

    $user = User::factory()->create();
    $this->actingAs($user);
    $offer = Offer::factory()->create(['price' => 100]);
    $click = OfferClick::factory()->create(['offer_id' => $offer->id]);

    $service = stripePurchaseService([
        'id' => 'cus_1', 'name' => 'A', 'last4' => null, 'pmType' => 'card',
        'paymentStatus' => 'paid', 'amountTotal' => 5000, // $50.00 from Stripe
        'sessionId' => 'cs_amount', 'clientReference' => (string) $offer->id,
    ]);

    // Client tries to claim a $1,000,000 purchase via the price param.
    $service->savePurchase($offer, purchaseRequest([
        'pmType' => 'stripe', 'session_id' => 'cs_amount', 'cid' => $click->id,
        'price' => 100000000, 'offer' => $offer->id,
    ]));

    $this->assertDatabaseHas('purchases', ['transaction_id' => 'cs_amount', 'purchase_amount' => 50.00]);
    $this->assertDatabaseMissing('purchases', ['purchase_amount' => 1000000.00]);
});

test('an unpaid stripe session is rejected and grants nothing', function () {
    Event::fake([PurchasedItem::class]);

    $user = User::factory()->create();
    $this->actingAs($user);
    $offer = Offer::factory()->create();

    $service = stripePurchaseService([
        'id' => 'cus_1', 'name' => 'A', 'last4' => null, 'pmType' => 'card',
        'paymentStatus' => 'unpaid', 'amountTotal' => 12345,
        'sessionId' => 'cs_unpaid', 'clientReference' => (string) $offer->id,
    ]);

    $result = $service->savePurchase($offer, purchaseRequest([
        'pmType' => 'stripe', 'session_id' => 'cs_unpaid', 'offer' => $offer->id,
    ]));

    expect($result['success'])->toBeFalse();
    $this->assertDatabaseCount('purchases', 0);
    expect($user->fresh()->hasRole('course.user'))->toBeFalse();
    Event::assertNotDispatched(PurchasedItem::class);
});

test('a stripe session for a different offer is rejected', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    $offer = Offer::factory()->create();

    $service = stripePurchaseService([
        'id' => 'cus_1', 'name' => 'A', 'last4' => null, 'pmType' => 'card',
        'paymentStatus' => 'paid', 'amountTotal' => 12345,
        'sessionId' => 'cs_other', 'clientReference' => '999999', // not this offer
    ]);

    $result = $service->savePurchase($offer, purchaseRequest([
        'pmType' => 'stripe', 'session_id' => 'cs_other', 'offer' => $offer->id,
    ]));

    expect($result['success'])->toBeFalse();
    $this->assertDatabaseCount('purchases', 0);
});

test('replaying a stripe success does not create a duplicate purchase', function () {
    Event::fake([PurchasedItem::class]);

    $user = User::factory()->create();
    $this->actingAs($user);
    $offer = Offer::factory()->create();
    $click = OfferClick::factory()->create(['offer_id' => $offer->id]);

    $billing = [
        'id' => 'cus_1', 'name' => 'A', 'last4' => null, 'pmType' => 'card',
        'paymentStatus' => 'paid', 'amountTotal' => 10000,
        'sessionId' => 'cs_dup', 'clientReference' => (string) $offer->id,
    ];
    $request = purchaseRequest(['pmType' => 'stripe', 'session_id' => 'cs_dup', 'cid' => $click->id, 'offer' => $offer->id]);

    stripePurchaseService($billing)->savePurchase($offer, $request);
    stripePurchaseService($billing)->savePurchase($offer, $request);

    $this->assertDatabaseCount('purchases', 1);
});

// ---------------------------------------------------------------------------
// PayPal
// ---------------------------------------------------------------------------

test('a verified paypal capture records the purchase with server values', function () {
    Event::fake([PurchasedItem::class]);

    $user = User::factory()->create();
    $this->actingAs($user);
    $offer = Offer::factory()->create();
    $click = OfferClick::factory()->create(['offer_id' => $offer->id]);

    $this->mock(PayPalService::class, function ($mock) {
        $mock->shouldReceive('captureAndVerifyOrder')->once()->andReturn([
            'status'         => 'active',
            'transaction_id' => 'PAYPAL-CAP-1',
            'amount'         => 75.00,
            'payer_name'     => 'Bob Payer',
            'payer_id'       => 'PID-1',
        ]);
    });

    $result = app(PurchaseService::class)->savePurchase($offer, purchaseRequest([
        'pmType' => 'paypal', 'orderId' => 'ORDER-1',
        'cid' => $click->id, 'offer' => $offer->id, 'customerId' => 'PID-1',
    ]));

    expect($result['success'])->toBeTrue();
    $this->assertDatabaseHas('purchases', [
        'transaction_id'  => 'PAYPAL-CAP-1',
        'purchase_amount' => 75.00,
        'pm_type'         => 'paypal',
    ]);
    Event::assertDispatched(PurchasedItem::class);
});

test('an unverifiable paypal order is rejected and grants nothing', function () {
    Event::fake([PurchasedItem::class]);

    $user = User::factory()->create();
    $this->actingAs($user);
    $offer = Offer::factory()->create();

    $this->mock(PayPalService::class, function ($mock) {
        $mock->shouldReceive('captureAndVerifyOrder')->once()->andReturnNull();
    });

    $result = app(PurchaseService::class)->savePurchase($offer, purchaseRequest([
        'pmType' => 'paypal', 'orderId' => 'BAD-ORDER', 'offer' => $offer->id,
    ]));

    expect($result['success'])->toBeFalse();
    $this->assertDatabaseCount('purchases', 0);
    expect($user->fresh()->hasRole('course.user'))->toBeFalse();
    Event::assertNotDispatched(PurchasedItem::class);
});
