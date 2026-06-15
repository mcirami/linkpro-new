<?php

namespace App\Services;

use App\Events\PurchasedItem;
use App\Models\Purchase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use App\Http\Traits\BillingTrait;
use Stripe\Exception\ApiErrorException;
use Stripe\StripeClient;

class PurchaseService {

    use BillingTrait;

    private StripeClient $gateway;

    public function __construct() {
        $this->gateway = $this->createStripeGateway();

        return $this->gateway;
    }

    /**
     * @throws ApiErrorException
     */
    public function showCheckoutPage($course, $request): \Stripe\Checkout\Session {

        $authUser = Auth::user();
        $offer = $course->Offer()->first();
        $domain = config('app.url');
        $customerId = $authUser->billing_id;

        if ($customerId && str_contains($customerId, 'cus')) {
            $customerData = ['customer' => $customerId];
        } else {
            $customerData = [
                'customer_creation' => 'always',
                'customer_email'=> $authUser->email
            ];
        }

        $logo = $course->logo ?: 'https://lp-production-images.s3.us-east-2.amazonaws.com/logo.png';
        $affRef = $request->get('a') ? $request->get('a') : "none";
        $clickId = $request->get('cid') ? $request->get('cid') : "internal";
        $price = bcmul($offer->price, 100);

        return $this->gateway->checkout->sessions->create([
            'success_url'   => $domain . '/purchase/success?session_id={CHECKOUT_SESSION_ID}&offer=' . $offer->id . '&price=' . $price . '&affRef=' . $affRef . '&cid=' . $clickId,
            'cancel_url'    => $domain . '/purchase/cancel-checkout',
            'line_items'    =>
                [[
                    'price_data' => [
                        'currency'      => 'usd',
                        'unit_amount'   => $price,
                        'product_data'  => [
                            'name'          => $course->title,
                            'description'   => 'One time payment of $' . $offer->price . ' will get you access to all videos in this course.',
                            'images'        => [$logo]
                        ]
                    ],
                    'quantity'      => 1,
                ]],
            'mode'                      => 'payment',
            'payment_method_types'      => [],
            'invoice_creation'          => ['enabled' => true],
            'allow_promotion_codes'     => true,
            // Tie the session to this offer/user so the success handler can
            // verify the session genuinely belongs to this purchase.
            'client_reference_id'       => (string) $offer->id,
            'metadata'                  => [
                'offer_id' => $offer->id,
                'user_id'  => $authUser->id,
            ],
            $customerData
        ]);
    }

    /**
     * Record a course purchase ONLY after verifying the payment with the
     * gateway. Amounts and status come from Stripe/PayPal, never from the
     * client, and the write is idempotent on the gateway transaction id.
     *
     * @param $offer
     * @param $request
     *
     * @return array
     */
    public function savePurchase($offer, $request): array {

        $user   = Auth::user();
        $course = $offer->Course()->first();
        $pmType = $request->pmType;

        // Affiliate click id used for commission attribution.
        if ( $request->cid && $request->cid != "" ) {
            $clickId = $request->cid;
        } else {
            $clickId = Cookie::get( 'lpcid_' . $request->affRef . '_' . $offer->id );
        }

        if ($pmType == "paypal") {

            // Capture and verify the order with PayPal server-side.
            $verified = app(PayPalService::class)->captureAndVerifyOrder($request->orderId);

            if (!$verified || $verified['amount'] === null) {
                return [
                    "success" => false,
                    "message" => "We couldn't verify your PayPal payment. If you were charged, please contact support.",
                ];
            }

            $transactionId = $verified['transaction_id'];
            $customerName  = $verified['payer_name'];
            $purchaseData  = [
                'user_id'         => $user->id,
                'offer_click_id'  => $clickId,
                'customer_id'     => $verified['payer_id'] ?: $request->customerId,
                'transaction_id'  => $transactionId,
                'purchase_amount' => $verified['amount'],
                'pm_type'         => 'paypal',
                'status'          => $verified['status'],
            ];

        } else {

            // Verify the Stripe checkout session: it must be paid and must
            // belong to this offer (set as client_reference_id at creation).
            $billing      = $this->getCustomerBillingInfo($request);
            $isPaid       = ($billing['paymentStatus'] ?? null) === 'paid';
            $matchesOffer = (string) ($billing['clientReference'] ?? '') === (string) $offer->id;

            if (!$isPaid || !$matchesOffer) {
                return [
                    "success" => false,
                    "message" => "We couldn't verify your payment. If you were charged, please contact support.",
                ];
            }

            $transactionId = $billing['sessionId'];
            $customerName  = $billing['name'];
            $purchaseData  = [
                'user_id'         => $user->id,
                'offer_click_id'  => $clickId,
                'customer_id'     => $billing['id'],
                'transaction_id'  => $transactionId,
                // Amount is the Stripe-confirmed total (in cents), never the client value.
                'purchase_amount' => (float) number_format( $billing['amountTotal'] / 100, 2, '.', '' ),
                'pm_last_four'    => $billing['last4'],
                'pm_type'         => $billing['pmType'],
                'status'          => 'active',
            ];
        }

        // Idempotency: a refreshed success page must not create a second
        // purchase, re-grant access, or fire another commission.
        $existing = Purchase::where('transaction_id', $transactionId)->first();
        if ($existing) {
            return $this->purchaseResult($course, $customerName);
        }

        // Payment is verified — grant the buyer access and record the sale.
        if (!$user->getRoleNames()->contains("course.user")) {
            $user->assignRole('course.user');
        }

        $purchase = $course->Purchases()->create($purchaseData);
        PurchasedItem::dispatch( $purchase );

        return $this->purchaseResult($course, $customerName);
    }

    /**
     * Build the success payload returned to the controller.
     */
    private function purchaseResult($course, $customerName): array {
        return [
            "success"      => true,
            "message"      => "Congrats! You Have Purchased The " . str_replace( '-', " ", $course->slug ) . " Course",
            "courseSlug"   => $course->slug,
            'courseTitle'  => $course->title,
            "customerName" => $customerName,
        ];
    }
}
