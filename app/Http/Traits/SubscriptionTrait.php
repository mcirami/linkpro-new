<?php

namespace App\Http\Traits;
use App\Models\Referral;
use Braintree\Gateway;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Stripe\StripeClient;

trait SubscriptionTrait {


    /**
     * @return StripeClient
     */
    public function createGateway(): StripeClient {

        return new StripeClient(env('STRIPE_SECRET'));

    }

    /*public function checkPromoCode($planID, $userCode) {

        if ( $planID == "premier" && strtolower( $userCode ) == "6freepremier" ) {
            $match = "6FreePremier";
        } elseif ( $planID == "premier" && strtolower( $userCode ) == "1freepremier" ) {
            $match = "1FreePremier";
        } elseif($planID == "premier" && strtolower( $userCode ) == "freepremier") {
            $match = "bypass";
        } elseif ( $planID == "pro" && strtolower( $userCode ) == "6freepro" ) {
            $match = "6FreePro";
        } elseif ( $planID == "pro" && strtolower( $userCode ) == "1freepro" ) {
            $match = "1FreePro";
        } elseif ( $planID == "pro" && strtolower( $userCode ) == "freepro" ) {
            $match = "bypass";
        } else {
            $match = null;
        }

        return $match;
    }*/

    public function getPlanDetails($plan) {

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

    public function saveErrors($error) {
        //$errorString = "";

       /* foreach ($result->errors->deepAll() as $error) {*/
            //$errorString .= 'Error: ' . $error->code . ": " . $error->message . "\n";
            DB::table('transaction_errors')->insert([
                'code'          => $error->getCode(),
                'message'       => $error->getMessage(),
                'attribute'     => $error->getStripeCode(),
            ]);
        /*}*/
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
