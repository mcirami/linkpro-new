<?php


namespace App\Services;

use App\Notifications\NotifyAboutCancelation;
use App\Notifications\NotifyAboutResumeSub;
use App\Notifications\NotifyAboutUpgrade;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Http\Traits\BillingTrait;
use App\Http\Traits\UserTrait;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
use Throwable;

class SubscriptionService {

    use BillingTrait, UserTrait;

    private $user;

    /**
     * @param $user
     */
    public function __construct($user = null) {
        $this->user = $user ?: Auth::user();
        return $this->user;
    }

    /**
     * @param $request
     *
     * @return Session
     * @throws ApiErrorException
     */
    public function getPurchasePage($request): \Stripe\Checkout\Session {

        $stripe     = $this->createGateway();
        $domain     = config('app.url');
        $planName   = $request->get('plan') ?? null;
        $lineItems  = $this->getPlanDetails($planName);
        $email      = $this->user->email;
        $customerId = $this->user->billing_id;
        $type       = $request->get('type');
        $additionalVars = "";

        if ($type == "change_payment_method") {
            $subscriptionStartDate = Carbon::parse($this->user->subscriptions()->pluck('created_at')->first());
            $billingDateTimestamp = $subscriptionStartDate->addMonth()->endOfDay()->getTimestamp();
            $dynamicData['subscription_data'] = [
                'proration_behavior'    => 'none',
                'billing_cycle_anchor'  => $billingDateTimestamp,
            ];
            $dynamicData['custom_text'] = [
                'submit' => [
                    'message' => 'NOTE: PAYMENT PROCESSOR WILL BE CHANGED FROM PAYPAL TO STRIPE. YOU WILL NOT BE CHARGED UNTIL THE END OF YOUR CURRENT SUBSCRIPTION PERIOD.'
                ]
            ];
            $additionalVars = '&type=change_payment_method';
        }

        // check if user already has a billing id and be sure it's from stripe ie. starts with 'cus'
        if ($customerId && str_contains($customerId, 'cus')) {
            $dynamicData['customer'] = $customerId;
        } else {
            $dynamicData['customer_email'] = $email;
        }

        $session = "";

        try {
            $session = $stripe->checkout->sessions->create( [
                'success_url'           => $domain . '/subscribe/stripe-success?session_id={CHECKOUT_SESSION_ID}&plan=' . $planName . $additionalVars,
                'cancel_url'            => $domain . '/subscribe/cancel-checkout',
                'line_items'            => [
                    [
                        'price'    => $lineItems['ApiId'],
                        'quantity' => 1
                    ]
                ],
                'mode'                  => 'subscription',
                'allow_promotion_codes' => ! ( $type == "change_payment_method" ),
                'payment_method_types'  => [],
                $dynamicData
            ] );
        } catch ( ApiErrorException $e ) {
            $this->saveErrors($e);
            http_response_code(500);
        }

        return $session;
    }

    /**
     * @param $request
     *
     * @return array
     */
    public function getStripeSuccessPage($request): array {

        $plan           = $request->get('plan') ?? null;
        $billing        = $this->getCustomerBillingInfo($request);

        return [
            'planId'        => $plan,
            'subId'         => $billing['subId'],
            'status'        => $billing['status'],
            'customerId'    => $billing['id'] ?: null,
            'customerName'  => $billing['name'] ?: null,
            'paymentType'   => $billing['pmType'],
            'last4'         => $billing['last4'],
            'pmId'          => $billing['pmId'],
        ];
    }

    /**
     * create new user subscription and update user billing info
     *
     * @param $data
     *
     */
    public function newStripeSubscription($data): void {

        $this->user->subscriptions()->create( [
            'name'      => $data['planId'],
            'sub_id'    => $data['subId'],
            'status'    => $data['status']
        ] );

        $this->user->update([
            'billing_id'    => $data['customerId'],
            'pm_last_four'  => $data['last4'],
            'pm_type'       => $data['paymentType'],
            'pm_id'         => $data['pmId']
        ]);

        if ($this->user->email_subscription) {

            $userData = ( [
                'plan'    => ucfirst($data['planId']),
                'userID'  => $this->user->id,
            ] );

            $this->user->notify( new NotifyAboutUpgrade( $userData ) );
        }

    }

    /**
     * @param $request
     *
     * @return void
     */
    public function updateGateway($request): void {
        $this->updateStripeInfo($request);
    }

    /**
     *
     * Update user subscription level
     *
     * @param $plan
     * @param null $defaultPage
     *
     * @return array
     */
    public function updateSubscription($plan, $defaultPage = null): array {

        $activeSubs = $this->getUserSubscriptions($this->user);

        $activeSubs->update( [
            'name'          => $plan,
            'downgraded'    => $plan == "pro"
        ] );

        $this->updateUserPages($this->user, $defaultPage, $plan);

        $data = [];
        if($plan == "premier") {
            if ( $this->user->email_subscription ) {

                $userData = ( [
                    'plan'   => ucfirst( $plan ),
                    'userID' => $this->user->id,
                ] );

                $this->user->notify( new NotifyAboutUpgrade( $userData ) );
            }

            $data = [
                "success" => true,
                "message" => "Your plan has been upgraded to the Premier level"
            ];
        }

        if ($plan == "pro") {
            $data = [
                "success" => true,
                "message" => "Your plan has been downgraded to the Pro level"
            ];
        }

        return $data;
    }

    /**
     * @param $request
     *
     * @return array
     * @throws Throwable
     */
    public function cancelAtGateway($request): array {

        $subId = $request->subId;
        $data = [];

        if($request->pmType == "paypal") {

            $this->cancelPayPalSubscription($subId);

            $getEndpoint = "https://api-m.sandbox.paypal.com/v1/billing/subscriptions/" . $subId;
            $data = $this->payPalGetCall($getEndpoint, "cancel");

        } else {
            $stripe = $this->createGateway();

            try {

                $sub = $stripe->subscriptions->cancel( $subId );

                $data = [
                    'success'   => true,
                    'status'    => $sub->status,
                    'endDate'   => $sub->current_period_end
                ];

            } catch ( ApiErrorException $e ) {
                http_response_code( 500 );
                $this->saveErrors( $e );
            }
        }

        return $data;
    }

    /**
     *
     * Cancel subscription and update user access to content
     *
     * @param $gatewayData
     * @param $request
     *
     * @return array
     */
    public function cancelSubscriptionDB($gatewayData, $request): array {

        if($request->get('pmType') == "paypal") {
            $endDateDB = $gatewayData["endDate"];
            $endDateMail = Carbon::parse($gatewayData["endDate"])->format( 'F j, Y' );
        } else {
            $billingEndDate = Carbon::createFromTimestamp($gatewayData["endDate"]);
            $endDateDB = $billingEndDate->endOfDay();
            $endDateMail = $billingEndDate->format( 'F j, Y' );
        }

        $subscription = $this->getUserSubscriptions($this->user);
        $subscription->status = strtolower($gatewayData['status']);
        $subscription->ends_at = $endDateDB;
        $subscription->save();

        if ($request->get('defaultPage')) {
            $this->updateUserDefaultPage($this->user, $request->get('defaultPage'));
        }

        if ($this->user->email_subscription) {

            $userData = ( [
                'end_date' => $endDateMail,
                'userID'   => $this->user->id,
            ] );

            $this->user->notify( new NotifyAboutCancelation( $userData ) );
        }

        return [
            "success"   => true,
            "message"   => "Your Subscription Has Been Cancelled",
            "ends_at"  => $endDateMail
        ];
    }

    /**
     * @param $request
     *
     * @return array
     * @throws Throwable
     */
    public function resumeAtGateway($request): array {

        $activeSubs = $this->getUserSubscriptions($this->user);

        if($request->get('pmType') == "paypal") {
            $subId = $request->subId;
            $endpoint = "https://api-m.sandbox.paypal.com/v1/billing/subscriptions/" . $subId . "/activate";
            $this->payPalPostCall($endpoint);

            $returnData = [
                'status'    => "active",
                'sub'       => $activeSubs,
                'sub_id'    => $subId
            ];
        } else {

            $returnData = $this->resumeStripeSubscription($activeSubs, $request);

        }


        return $returnData;
    }

    /**
     * @param $request
     *
     * @return void
     */
    private function updateStripeInfo($request): void {

        $price = $this->getPlanDetails($request->get('plan'));
        $stripe = $this->createGateway();
        try {

            //$subscriptions = $stripe->subscriptions->all(['customer' => $user->billing_id]);

            $stripe->subscriptions->update(
                $request->get('subId'),
                ['items'    => [[
                    //'id'    => $subscriptions->data[0]->items->data[0]->id,
                    'price' => $price['ApiId'],
                ]]],
            );

        } catch ( ApiErrorException $e ) {
            http_response_code(500);
            $this->saveErrors($e);
        }
    }

    /**
     *
     * Resume subscription by creating new subscription and setting start date to previous subscription end date
     * If previous subscription has expired then create new subscription without end date
     *
     * @param $data array
     *
     * @return array
     */
    public function resumeSubscriptionDB( array $data): array {
        $sub = $data['sub'];
        $timestamp = strtotime($sub->ends_at);
        $timestamp += 60*60*24;
        $sub->update([
            'status'    => $data['status'],
            'ends_at'   => NULL,
            'sub_id'    => $data['sub_id']
        ]);

        if ($this->user->email_subscription) {

            $userData = ( [
                'userID'        => $this->user->id,
                'username'      => $this->user->username,
                'link'          => $this->getDefaultUserPage($this->user)[0],
                'billingDate'   => $timestamp ? date('F j, Y', $timestamp) : null,
            ] );

            $this->user->notify( new NotifyAboutResumeSub( $userData ) );
        }

        return [
            "success" => true,
            "message" => "Your subscription has been resumed"
        ];
    }

    /**
     * create new user subscription and update user billing info from PayPal Data
     *
     * @param $data
     *
     */
    public function newPayPalSubscription($data): void {

        $this->user->subscriptions()->create( [
            'name'      => $data['planId'],
            'sub_id'    => $data['subId'],
            'status'    => "active"
        ] );

        $this->user->update([
            'pm_type'       => $data['paymentType'],
            'billing_id'    => $data['userEmail']
        ]);

        if ($this->user->email_subscription) {

            $userData = ( [
                'plan'    => ucfirst($data['planId']),
                'userID'  => $this->user->id,
            ] );

            $this->user->notify( new NotifyAboutUpgrade( $userData ) );
        }

    }

    /**
     * @throws Throwable
     */
    public function cancelPayPalSubscription($subId = null): void {
        if(!$subId) {
            $userSub = $this->getUserSubscriptions($this->user);
            $subId = $userSub->sub_id;
        }

        $postEndpoint = "https://api-m.sandbox.paypal.com/v1/billing/subscriptions/" . $subId . "/suspend";
        $sendData = [
            "reason" => "Customer-requested pause"
        ];
        $this->payPalPostCall($postEndpoint, $sendData);
    }

    /**
     * @param $endpoint
     * @param array|string $sendData
     *
     * @throws Throwable
     */
    private function payPalPostCall($endpoint, array|string $sendData = []): void {

        $provider = new PayPalClient;
        $accessToken = $provider->getAccessToken();

        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => $endpoint,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_TIMEOUT => 30000,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => json_encode($sendData),
            CURLOPT_HTTPHEADER => array(
                // Set Here Your Requested Headers
                'Content-Type: application/json',
                'Accept: application/json',
                'Authorization: Bearer ' . $accessToken['access_token']
            )
        ));
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);
        if ($err) {
            $decodedResponse = "cURL Error getting sub #:" . $err;
            $this->saveErrors( $decodedResponse );
        }

    }

    /**
     * @param $endpoint
     * @param $type
     *
     * @return array|void
     * @throws Throwable
     */
    private function payPalGetCall($endpoint, $type) {
        $provider = new PayPalClient;
        $accessToken = $provider->getAccessToken();
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => $endpoint,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_TIMEOUT => 30000,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                // Set Here Your Requested Headers
                'Content-Type: application/json',
                'Accept: application/json',
                'Authorization: Bearer ' . $accessToken['access_token']
            )
        ));
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);
        if ($err) {
            $decodedResponse = "cURL Error getting sub #:" . $err;

            $this->saveErrors( $decodedResponse );
            return [
                'success'   => false,
                'error'     => $decodedResponse
            ];
        } else {
            $decodedResponse = json_decode($response, true);
            if ($type == "cancel") {
                $lastPayment = Carbon::parse($decodedResponse["billing_info"]["last_payment"]["time"]);
                $day = $lastPayment->day;
                $dt = Carbon::now()->addMonth();
                $dt->day = $day;
                $endDate = $dt->endOfDay()->format('Y-m-d H:i:s');

                return [
                    'success'   => true,
                    'status'    => "canceled",
                    'endDate'   => $endDate
                ];
            }
        }
    }

    /**
     * @param $activeSubs
     * @param $request
     *
     * @return array
     */
    public function resumeStripeSubscription($activeSubs, $request): array {
        $stripe = $this->createGateway();
        $customerNumber = $this->user->billing_id;
        $startDate = Carbon::parse($activeSubs->ends_at);
        $lineItems = $this->getPlanDetails($request->get('plan'));

        $response = "";
        try {
            $response = $stripe->subscriptions->create([
                'customer'                      => $customerNumber,
                'items'                         => [['price' => $lineItems['ApiId'] ]],
                'billing_cycle_anchor_config'   => ['day_of_month' => $startDate->day],
                'default_payment_method'        => $this->user->pm_id
            ]);


        } catch ( ApiErrorException $e ) {
            http_response_code(500);
            $this->saveErrors($e);
        }

        return [
            'status'    => $response->status,
            'sub'       => $activeSubs,
            'sub_id'    => $response->id
        ];
    }

    public function updateUserPaymentMethod($data): void {

        $this->user->update([
            'pm_type'       => $data['paymentType'],
            'billing_id'    => $data['customerId'],
            'pm_last_four'  => $data['last4'],
            'pm_id'         => $data['pmId']
        ]);
    }

    public function updateUserSubDetails($data): void {
        $userSub = $this->getUserSubscriptions($this->user);

        $userSub->update( [
            'sub_id'    => $data['subId'],
            'status'    => $data['status'],
        ] );
    }

    /*public function createManualSubscription($code) {

        if (strtolower( $code ) == "freepremier") {
            $subName = "premier";
        } else {
            $subName = "pro";
        }

        $this->user->subscriptions()->create( [
            'name'              => $subName,
            'sub_id'        => "bypass",
            'status'            => "active",
        ] );

        $this->user->update(["billing_id" => "bypass"]);

        if ($this->user->email_subscription) {

            $userData = ( [
                'plan'    => $subName,
                'userID'  => $this->user->id,
            ] );

            $this->user->notify( new NotifyAboutUpgrade( $userData ) );
        }

        return [
            "success" => true,
            "message" => "Your account has been upgraded!"
        ];

    }

    public function updateSubscriptionManually($code) {

        if (strtolower( $code ) == "freepremier") {
            $subName = "premier";
        } else {
            $subName = "pro";
        }

        $activeSubs = $this->getUserSubscriptions($this->user);
        $activeSubs->update( [
            'name'          => $subName,
            'sub_id'        => "bypass",
            'status'        => "active",
            'ends_at'       => null
        ] );

        $this->user->update(["billing_id" => "bypass"]);

        if ($this->user->email_subscription) {

            $userData = ( [
                'plan'    => $subName,
                'userID'  => $this->user->id,
            ] );

            $this->user->notify( new NotifyAboutUpgrade( $userData ) );
        }

        return [
            "success" => true,
            "message" => "Your account has been upgraded!"
        ];

    }*/
}
