<?php

namespace App\Services;

use App\Models\Folder;
use App\Models\Referral;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Braintree\WebhookNotification;

class WebhookService {

    /**
     * @param $notification
     *
     * @return void
     */
    public function charged($notification) {

        if ( $notification->kind == 'subscription_charged_successfully' ) {

            $subId = $notification->subscription->id;
            $planId = $notification->subscription->planId;

            $subscription = Subscription::where('braintree_id', $subId )->first();
            if ($subscription != null) {
                $referral = Referral::where( 'referral_id', $subscription->user_id )->orderBy( 'updated_at',
                    'DESC' )->first();

                if ( $referral != null ) {

                    if ( $referral->plan_id == null ) {

                        $referral->update( [
                            'subscription_id' => $subscription->id,
                            'plan_id'         => $planId
                        ] );

                    } else {

                        if ( $referral->plan_id == $planId ) {

                            Referral::create( [
                                'referral_id'     => $referral->referral_id,
                                'user_id'         => $referral->user_id,
                                'subscription_id' => $subscription->id,
                                'plan_id'         => $planId
                            ] );

                        } else {

                            $referral->update( [
                                'plan_id' => $planId
                            ] );

                        }
                    }
                }
            }

            /*Log::channel( 'webhooks' )->info( $notification->timestamp->format('D M j G:i:s T Y') .
                                              " --- kind --- " .
                                              $notification->kind .
                                              " --- plan id --- " .
                                              $planId .
                                              " --- sub id --- " .
                                              $subId
            );*/

            Log::channel( 'cloudwatch' )->info( $notification->timestamp->format('D M j G:i:s T Y') .
                                              " --- kind --- " .
                                              $notification->kind .
                                              " --- plan id --- " .
                                              $planId .
                                              " --- sub id --- " .
                                              $subId
            );

            header( "HTTP/1.1 200 OK" );
        }
    }

    public function wentActive($notification) {

        if ( $notification->kind == 'subscription_went_active' ) {

            $subId = $notification->subscription->id;
            $subscription = Subscription::where('braintree_id', $subId )->first();
            if ($subscription != null) {
                $subscription->update([
                    'braintree_status' => 'active'
                ]);

                Log::channel( 'cloudwatch' )->info( $notification->timestamp->format('D M j G:i:s T Y') .
                                                    " --- kind --- " .
                                                    $notification->kind .
                                                    " --- sub id --- " .
                                                    $subId
                );
            }

            header( "HTTP/1.1 200 OK" );
        }
    }

    /**
     * @param $gateway
     *
     * @return void
     */
    public function webhookTest($gateway, $type) {

        if ($type == 'SUBSCRIPTION_CHARGED_SUCCESSFULLY') {
            $sampleNotification = $gateway->webhookTesting()->sampleNotification(
                WebhookNotification::SUBSCRIPTION_CHARGED_SUCCESSFULLY,
                    'kgztvm'
                );
        } else if ($type == 'SUBSCRIPTION_EXPIRED') {
            $sampleNotification = $gateway->webhookTesting()->sampleNotification(
                WebhookNotification::SUBSCRIPTION_EXPIRED,
                'kgztvm'
            );
        } else if ($type = 'SUBSCRIPTION_WENT_ACTIVE') {
            $sampleNotification = $gateway->webhookTesting()->sampleNotification(
                WebhookNotification::SUBSCRIPTION_WENT_ACTIVE,
                '7m249m'
            );
        }


        $notification = $gateway->webhookNotification()->parse(
            $sampleNotification['bt_signature'],
            $sampleNotification['bt_payload']
        );

        /*Log::channel( 'webhooks' )->info( $notification->timestamp->format('D M j G:i:s T Y') .
                                          " --- kind --- " .
                                          $notification->kind
        );*/
        Log::channel( 'cloudwatch' )->info( $notification->timestamp->format('D M j G:i:s T Y') .
                                          " --- kind --- " .
                                          $notification->kind .
                                            " -- sub id --" .
                                            $notification->subscription->id
        );

    }
}
