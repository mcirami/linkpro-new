<?php

namespace App\Services;

use App\Models\Folder;
use App\Models\Subscription;
use App\Models\User;
use Carbon\Carbon;
use App\Http\Traits\BillingTrait;
use Stripe\Exception\ApiErrorException;

class WebhookService {

    use BillingTrait;

    /**
     * @param $subId
     * @param $productId
     *
     * @return void
     */
    public function updateSubscription($subId, $productId): void {
        $productName = $this->getProductName($productId);
        $subscription = Subscription::where('sub_id', $subId )->first();

        if($subscription) {
            $user                = User::findOrFail( $subscription->user_id );
            $subscriptionService = new SubscriptionService( $user );
            $subscriptionService->updateSubscription( $productName );
        }
    }

    /**
     * @param $subId
     * @param $endDate
     *
     * @return void
     */
    public function cancelSubscription($subId, $endDate): void {
        $subscription = Subscription::where('sub_id', $subId )->first();
        $billingEndDate = Carbon::createFromTimestamp($endDate);
        $endDateDB = $billingEndDate->endOfDay();

        if ($subscription != null) {
            $subscription->update( [
                'status'    => 'canceled',
                'ends_at'   => $endDateDB
            ] );
        }
    }

    /**
     * @param $customer
     *
     * @return void
     */
    public function checkDefaultPaymentMethod($customer): void {

        $stripe = $this->createGateway();
        $defaultPm = null;
        try {
            $stripeCustomer = $stripe->customers->retrieve($customer);
            $defaultPm = $stripeCustomer->invoice_settings->default_payment_method;
        } catch ( ApiErrorException $e ) {
            http_response_code(500);
            $this->saveErrors($e);
        }
        if ($defaultPm) {
            $user = User::where('billing_id', '=', $customer)->first();
            if($user) {
                $customerPm = null;
                try {
                    $customerPm = $stripe->customers->retrievePaymentMethod(
                        $customer,
                        $defaultPm
                    );
                } catch ( ApiErrorException $e ) {
                    http_response_code(500);
                    $this->saveErrors($e);
                }
                if($customerPm) {
                    $pmType = $customerPm->type;
                    $last4  = $pmType == "card" ? $customerPm->card->last4 : null;

                    if ( ( $user->pm_id && $user->pm_id != $defaultPm ) || ! $user->pm_id ) {
                        $user->update( [
                            'pm_id'        => $defaultPm,
                            'pm_last_four' => $last4,
                            'pm_type'      => $pmType
                        ] );
                    }
                }
            }
        }
    }

    /**
     * @param $subId
     * @param $productId
     *
     * @return void
     */
    public function handleSubscriptionEnded($subId, $productId): void {
        $productName = $this->getProductName($productId);
        $subscription = Subscription::where('sub_id', '=', $subId)->first();

        if($productName == "premier") {
            $user      = User::findOrFail( $subscription->user_id );
            $userPages = $user->pages()->get();

            foreach ( $userPages as $userPage ) {

                if ( $userPage->default ) {

                    $folders = Folder::where( 'page_id', $userPage->id )->get();
                    if ( $folders->isNotEmpty() ) {
                        foreach ( $folders as $folder ) {
                            if ( $folder->active_status ) {
                                $folder->active_status = false;
                                $folder->save();
                            }
                        }
                    }

                } else {
                    $userPage->disabled = true;
                }

                $userPage->save();
            }
        }

        $subscription->update([
            'name'          => "free",
            'ends_at'       => null,
            'sub_id'        => null,
            'downgraded'    => $productName == "pro"
        ]);
    }

    /**
     * @param $productId
     *
     * @return string|null
     */
    private function getProductName($productId): ?string {

        $productName = null;
        switch($productId) {
            case 'prod_K6EHjP7cweNNcM':
                $productName = "pro";
                break;
            case 'prod_PbvMZt4HkzDqx6':
                $productName = "premier";
                break;
            default:
                break;
        }

        return $productName;
    }
}
