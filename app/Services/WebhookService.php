<?php

namespace App\Services;

use App\Models\Folder;
use App\Models\Subscription;
use App\Models\User;
use App\Notifications\NotifyAboutPaymentFailed;
use Carbon\Carbon;
use App\Http\Traits\BillingTrait;
use Illuminate\Support\Facades\DB;
use Stripe\Exception\ApiErrorException;

class WebhookService
{

    use BillingTrait;

    /**
     * @param $subId
     * @param $productId
     *
     * @return void
     */
    public function updateSubscription($subId, $productId): void
    {
        $productName = $this->getProductName($productId);
        $subscription = Subscription::where('sub_id', $subId)->first();

        if ($subscription) {
            $user                = User::findOrFail($subscription->user_id);
            $subscriptionService = new SubscriptionService($user);
            $subscriptionService->updateSubscription($productName);
        }
    }

    /**
     * @param $subId
     * @param $endDate
     *
     * @return void
     */
    public function cancelSubscription($subId, $endDate): void
    {
        $subscription = Subscription::where('sub_id', $subId)->first();
        $billingEndDate = Carbon::parse($endDate);
        $endDateDB = $billingEndDate->endOfDay();

        if ($subscription != null) {
            $subscription->update([
                'status'    => 'canceled',
                'ends_at'   => $endDateDB
            ]);
        }
    }

    /**
     * @param $customer
     *
     * @return void
     *
     */
    public function checkDefaultPaymentMethod($customer): void
    {

        $stripe = $this->createStripeGateway();
        $defaultPmId = null;
        try {
            $stripeCustomer = $stripe->customers->retrieve(
                $customer,
                ['expand' => ['customer', 'payment_intent.payment_method']]
            );
            $defaultPmId = $stripeCustomer->invoice_settings->default_payment_method;
        } catch (ApiErrorException $e) {
            http_response_code(500);
            $this->saveErrors($e);
        }
        if ($defaultPmId) {
            $this->updateDefaultPaymentMethod($defaultPmId, $customer);
        }
    }

    /**
     * @param $defaultPmId
     * @param $customer
     *
     * @return void
     *
     *
     */
    public function updateDefaultPaymentMethod($defaultPmId, $customer): void
    {

        $stripe = $this->createStripeGateway();
        $user = User::where('billing_id', '=', $customer)->first();
        if ($user) {
            $customerPm = null;
            try {
                $customerPm = $stripe->customers->retrievePaymentMethod(
                    $customer,
                    $defaultPmId
                );
            } catch (ApiErrorException $e) {
                http_response_code(500);
                $this->saveErrors($e);
            }
            if ($customerPm) {
                $pmType = $customerPm->type;
                $last4  = $pmType == "card" ? $customerPm->card->last4 : null;

                if (($user->pm_id && $user->pm_id != $defaultPmId) || !$user->pm_id) {
                    $user->update([
                        'pm_id'        => $defaultPmId,
                        'pm_last_four' => $last4,
                        'pm_type'      => $pmType
                    ]);
                }
            }
        }
    }

    /**
     * @param $subId
     * @param $productId
     * @param $productName
     *
     * @return void
     */
    public function handleSubscriptionEnded($subId, $productId, $productName): void
    {
        if ($productId) {
            $productName = $this->getProductName($productId);
        }

        $subscription = Subscription::where('sub_id', '=', $subId)->first();

        if ($productName == "premier") {
            $user      = User::findOrFail($subscription->user_id);
            $userPages = $user->pages()->get();

            foreach ($userPages as $userPage) {

                if ($userPage->default) {

                    $folders = Folder::where('page_id', $userPage->id)->get();
                    if ($folders->isNotEmpty()) {
                        foreach ($folders as $folder) {
                            if ($folder->active_status) {
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
            'sub_id'        => null,
            'downgraded'    => true
        ]);
    }

    /**
     * A recurring payment failed but the subscription is still active while the
     * gateway retries. Flag it and ask the user to update their payment method;
     * access is intentionally left untouched (it is gated on ends_at).
     *
     * @param $subId
     *
     * @return void
     */
    public function handlePaymentFailed($subId): void
    {
        $subscription = Subscription::where('sub_id', '=', $subId)->first();

        if (!$subscription) {
            return;
        }

        $subscription->update(['status' => 'past_due']);

        $this->notifyPaymentFailed($subscription, false);
    }

    /**
     * The gateway exhausted its retries and suspended the subscription. Treat
     * this like the subscription ending: downgrade to free, disable premium
     * features, and notify the user so they can reactivate.
     *
     * @param $subId
     * @param $planName
     *
     * @return void
     */
    public function handleSubscriptionSuspended($subId, $planName): void
    {
        $subscription = Subscription::where('sub_id', '=', $subId)->first();

        if (!$subscription) {
            return;
        }

        // Capture the paid plan name before the downgrade rewrites it to "free".
        $planLabel = $subscription->name;

        $this->handleSubscriptionEnded($subId, null, $planName);

        $this->notifyPaymentFailed($subscription, true, $planLabel);
    }

    /**
     * Send the payment-failure email to the subscription's owner.
     *
     * @param Subscription $subscription
     * @param bool $suspended
     * @param string|null $planLabel
     *
     * @return void
     */
    private function notifyPaymentFailed(Subscription $subscription, bool $suspended, ?string $planLabel = null): void
    {
        $user = User::find($subscription->user_id);

        if (!$user) {
            return;
        }

        $user->notify(new NotifyAboutPaymentFailed([
            'plan'      => ucfirst($planLabel ?? $subscription->name ?? 'subscription'),
            'userID'    => $user->id,
            'suspended' => $suspended,
        ]));
    }

    /**
     * @param $object
     *
     * @return void
     */
    public function addPlan($object): void
    {

        $name = strtolower(explode(" ", $object->name)[0]);

        DB::table('plans')->insert([
            'name'          => $name,
            'product_id'    => $object->id,
            'price'         => null,
            'price_id'      => $object->default_price,
            'description'   => $object->description,
            'created_at'    => Carbon::now()->format('Y-m-d H:i:s'),
            'updated_at'    => Carbon::now()->format('Y-m-d H:i:s')
        ]);

        $this->updatePlan($object);
    }


    /**
     * @param $object
     *
     * @return void
     *
     */
    public function updatePlan($object): void
    {

        $stripe = $this->createStripeGateway();
        try {
            $product            = $stripe->products->retrieve($object->id);
            $unconvertedPrice   = $stripe->prices->retrieve($product->default_price);
            $price              = ($unconvertedPrice->unit_amount / 10) / 10;
            $name               = strtolower(explode(" ", $product->name)[0]);

            DB::table('plans')->where('product_id', '=', $object->id)->update([
                'name'          => $name,
                'price'         => $price,
                'price_id'      => $product->default_price,
                'description'   => $object->description,
                'updated_at'    => Carbon::now()->format('Y-m-d H:i:s')
            ]);
        } catch (ApiErrorException $e) {
            http_response_code(500);
            $this->saveErrors($e);
        }
    }

    /**
     * @param $object
     *
     * @return void
     */
    public function deletePlan($object): void
    {
        DB::table('plans')->where('product_id', '=', $object->id)->delete();
    }

    /**
     * @param $productId
     *
     * @return string|null
     */
    private function getProductName($productId): ?string
    {

        return DB::table('plans')->where('product_id', '=', $productId)->pluck('name')->first();
    }
}
