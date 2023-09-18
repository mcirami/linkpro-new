<?php

namespace App\Http\Traits;
use App\Models\Referral;
use Braintree\Gateway;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

trait SubscriptionTrait {

    /**
     *
     * Create new Braintree Gateway for Subscriptions
     *
     * @return Gateway
     *
     */

    public function createGateway() {

        $gateway = new Gateway([
            'environment' => config('services.braintree.environment'),
            'merchantId' => config('services.braintree.merchantId'),
            'publicKey' => config('services.braintree.publicKey'),
            'privateKey' => config('services.braintree.privateKey')
        ]);

        return $gateway;
    }

    public function checkPromoCode($planID, $userCode) {

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
    }

    public function getPlanDetails($plan) {

        if ($plan == 'pro') {
            $price = '4.99';
        }

        if ($plan == 'premier') {
            $price = '19.99';
        }

        return $price;
    }

    public function saveErrors($result) {
        //$errorString = "";

        foreach ($result->errors->deepAll() as $error) {
            //$errorString .= 'Error: ' . $error->code . ": " . $error->message . "\n";
            DB::table('transaction_errors')->insert([
                'code'          => $error->code,
                'message'       => $error->message,
                'attribute'     => $error->attribute,
            ]);
        }
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
