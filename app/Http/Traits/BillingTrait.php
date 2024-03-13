<?php

namespace App\Http\Traits;
use App\Models\Referral;
use Illuminate\Support\Facades\DB;
use Stripe\Exception\ApiErrorException;
use Stripe\StripeClient;

trait BillingTrait {


    /**
     * @return StripeClient
     */
    public function createGateway(): StripeClient {

        return new StripeClient(env('STRIPE_SECRET'));

    }

    /**
     * @param $plan
     *
     * @return array|string[]
     */
    public function getPlanDetails($plan): array {

        $data = [];
        if ($plan == 'pro') {
            $data = [
                'price'  => '4.99',
                'ApiId'   => 'price_1JS1p5GIBktjIJUPjG5ksGFb'
            ];
        }

        if ($plan == 'premier') {
            $data = [
                'price'  => '19.99',
                'ApiId'   => 'price_1OmhVwGIBktjIJUP744WAsfh',
            ];
        }

        return $data;
    }

    /**
     * @param $request
     *
     * @return array
     */
    public function getCustomerBillingInfo($request): array {

        try {
            $stripe     = $this->createGateway();
            $session    = $stripe->checkout->sessions->retrieve(
                $request->session_id,
                ['expand' => ['customer', 'payment_intent.payment_method']]
            );
            $customer      = $session->customer;//$stripe->customers->retrieve( $session->customer );
            $paymentMethod = $session->payment_intent->payment_method;//$stripe->customers->allPaymentMethods( $customer->id, [ 'limit' => 1 ] );

            $last4  = null;
            $pmType = null;
            $pmId = null;
            if ( !empty($paymentMethod) ) {
                if( $paymentMethod->type == "card" ) {
                    $last4 = $paymentMethod->card->last4;
                }

                $pmType = $paymentMethod->type;
                $pmId = $paymentMethod->id;
            }

            $data = [
                'id'        => $customer->id,
                'name'      => $customer->name,
                'last4'     => $last4,
                'pmType'    => $pmType,
                'pmId'      => $pmId,
                'invoice'   => $session->invoice,
                'status'    => $session->status == "complete" ? "active" : $session->status,
                'subId'     => $session->subscription
            ];

        } catch ( ApiErrorException $e ) {
            $this->saveErrors($e);
            http_response_code(500);
            $data = [
                "success" => false,
                "message" => 'An error occurred with the message: ' . $e
            ];
            //echo json_encode(['error' => $e->getMessage()]);
        }

        return $data;

    }

    /**
     * @param $error
     *
     * @return void
     */
    public function saveErrors($error): void {
        DB::table('transaction_errors')->insert([
            'code'          => $error->getCode(),
            'message'       => $error->getMessage(),
            'attribute'     => $error->getStripeCode(),
        ]);
    }

   /* public function addReferralSubID($user, $subscriptionID, $planID) {

        $referral = Referral::where('referral_id', $user->id)->first();

        if ($referral != null) {

            $user_id = $referral->user_id;
            $referral_id = $user->id;

            Referral::create([
                'user_id' => $user_id,
                'referral_id' => $referral_id,
                'subscription_id' => $subscriptionID,
                'plan_id' => $planID
            ]);
        }
    }*/

   /* public function updateReferral($planID, $userID) {

        $referral = Referral::where('referral_id', $userID)->orderBy('updated_at', 'DESC')->first();

        if ($referral != null) {

            $referral->update([
                'plan_id' => $planID
            ]);

        }
    }*/
}
