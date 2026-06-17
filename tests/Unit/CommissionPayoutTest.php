<?php

use App\Http\Traits\StatsTrait;

/**
 * Object exposing the StatsTrait::calculatePayout() logic for testing.
 */
function payoutCalculator(): object
{
    return new class
    {
        use StatsTrait;
    };
}

/**
 * Build a click row shaped like the stats query result.
 */
function click(?float $purchaseAmount, ?int $referralId): object
{
    return (object) [
        'purchase_amount' => $purchaseAmount,
        'referral_id'     => $referralId,
    ];
}

test('the affiliate who drove the sale earns 80% of the amount paid', function () {
    $clicks = collect([click(50.00, 7)]);

    // user 7 is the referral on the click -> 80% of 50.00
    expect(payoutCalculator()->calculatePayout($clicks, null, 7))->toBe('40.00');
});

test('a non-referring party earns 40% of the amount paid', function () {
    $clicks = collect([click(50.00, 7)]);

    // user 99 is not the referral on the click -> 40% of 50.00
    expect(payoutCalculator()->calculatePayout($clicks, null, 99))->toBe('20.00');
});

test('clicks without a purchase contribute nothing', function () {
    $clicks = collect([click(null, 7), click(null, 99)]);

    expect(payoutCalculator()->calculatePayout($clicks, null, 7))->toBe('0.00');
});

test('payout is based on the amount paid, NOT the current offer price', function () {
    // The purchase was made at $50. The offer price passed in (now $999)
    // must be ignored — this is the core of the commission-base fix.
    $clicks = collect([click(50.00, 7)]);

    expect(payoutCalculator()->calculatePayout($clicks, 999, 7))->toBe('40.00');
});

test('payouts sum across multiple purchases at the correct rates', function () {
    $clicks = collect([
        click(100.00, 5),   // referral -> 80.00
        click(100.00, 9),   // non-referral -> 40.00
        click(null, 5),     // no purchase -> 0
    ]);

    expect(payoutCalculator()->calculatePayout($clicks, null, 5))->toBe('120.00');
});
