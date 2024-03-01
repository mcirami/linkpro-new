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

class SubscriptionService {

    use BillingTrait, UserTrait;

    private $user;

    public function __construct() {
        $this->user = Auth::user();

        return $this->user;
    }

    /**
     * @param $request
     *
     * @return Session
     * @throws ApiErrorException
     */
    public function getPurchasePage($request): \Stripe\Checkout\Session {

        $domain     = config('app.url');
        $stripe     = $this->createGateway();
        $plan       = $request->get('plan') ?? null;
        $lineItems  = $this->getPlanDetails($plan);
        $email      = $this->user->email;
        $customerId = $this->user->billing_id;

        // check if user already has a billing id and be sure it's from stripe ie. starts with 'cus'
        if ($customerId && str_contains($customerId, 'cus')) {
            $customerData = ['customer' => $customerId];
        } else {
            $customerData = [
                'customer_email' => $email
            ];
        }

        $session = "";

        try {
            $session = $stripe->checkout->sessions->create( [
                'success_url'           => $domain . '/subscribe/success?session_id={CHECKOUT_SESSION_ID}&plan=' . $plan,
                'cancel_url'            => $domain . '/subscribe/cancel-checkout',
                'line_items'            => [
                    [
                        'price'    => $lineItems['ApiId'],
                        'quantity' => 1
                    ]
                ],
                'mode'                  => 'subscription',
                'allow_promotion_codes' => true,
                'payment_method_types'  => [],
                $customerData
            ] );
        } catch ( ApiErrorException $e ) {
            $this->saveErrors($e);
            http_response_code(500);
            //echo json_encode(['error' => $e->getMessage()]);
        }

        return $session;
    }

    /**
     * @param $request
     *
     * @return array
     */
    public function getSuccessPage($request): array {

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
     *
     * @param $data
     *
     */
    public function newSubscription($data): void {

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
     * @param $user
     * @param $request
     *
     * @return void
     */
    public function updateGateway($user, $request): void {

        $price = $this->getPlanDetails($request->get('plan'));
        $stripe = $this->createGateway();
        try {

            $subscriptions = $stripe->subscriptions->all(['customer' => $user->billing_id]);

            $stripe->subscriptions->update(
                $request->get('subId'),
                ['items'    => [[
                    'id'    => $subscriptions->data[0]->items->data[0]->id,
                    'price' => $price['ApiId'],
                ]]],
            );

        } catch ( ApiErrorException $e ) {
            http_response_code(500);
            $this->saveErrors($e);
            //echo json_encode(['error' => $e->getMessage()]);
        }
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

        $activeSubs->update( [ 'name' => $plan ] );

        $userPages = $this->getUserPages( $this->user );

        $data = [];
        if ( count( $userPages ) > 1) {
            foreach ( $userPages as $userPage ) {

                if($plan == "premier") {
                    if ( $userPage->disabled ) {
                        $userPage->disabled = false;
                        $userPage->save();
                    }
                }

                if ($plan == "pro" && $defaultPage) {
                    /*if ( $userPage->is_protected ) {
                        $userPage->is_protected = 0;
                        $userPage->password     = null;
                    }*/

                    if ( $defaultPage == $userPage->id ) {
                        $userPage->default  = true;
                        $userPage->disabled = false;
                        $this->user->update( [ 'username' => $userPage->name ] );
                    } else {
                        $userPage->default  = false;
                        $userPage->disabled = true;
                    }

                    $userPage->save();
                }
            }
        }

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
     */
    public function cancelGateway($request): array {

        $subId = $request->subId;
        $stripe = $this->createGateway();

        $data = [];
        try {

            $sub = $stripe->subscriptions->cancel($subId);

            $data = [
                'status'    => $sub->status,
                'endDate'   => $sub->current_period_end
            ];

        } catch ( ApiErrorException $e ) {
            http_response_code(500);
            $this->saveErrors($e);
            //echo json_encode(['error' => $e->getMessage()]);
        }

        return $data;
    }

    /**
     *
     * Cancel subscription and update user access to content
     *
     * @param $request
     *
     * @return array
     */
    public function cancelSubscription($gatewayData): array {

        $billingEndDate = Carbon::createFromTimestamp($gatewayData["endDate"]);
        $endDateDB = $billingEndDate->endOfDay();
        $endDateMail = $billingEndDate->format( 'F j, Y' );

        $subscription = $this->getUserSubscriptions($this->user);
        $subscription->status = strtolower($gatewayData['status']);
        $subscription->ends_at = $endDateDB;
        $subscription->save();

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
     */
    public function resumeGateway($request): array {

        $stripe = $this->createGateway();
        $customerNumber = $this->user->billing_id;
        $activeSubs = $this->getUserSubscriptions($this->user);
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
            //echo json_encode(['error' => $e->getMessage()]);
        }

        return [
            'status'    => $response->status,
            'sub'       => $activeSubs
        ];
    }

    /**
     *
     * Resume subscription by creating new subscription and setting start date to previous subscription end date
     * If previous subscription has expired then create new subscription without end date
     *
     * @param $status
     *
     * @return array
     */
    public function resumeSubscription($status, $sub): array {

        $timestamp = strtotime($sub->ends_at);
        $timestamp += 60*60*24;
        $sub->update([
            'status'    => $status,
            'ends_at'   => NULL,
        ]);

        if ($this->user->email_subscription) {

            $userData = ( [
                'userID'        => $this->user->id,
                'username'      => $this->user->username,
                'link'          => $this->getDefaultUserPage($this->user)[0],
                'billingDate'   =>  $timestamp ? date('F j, Y', $timestamp) : null,
            ] );

            $this->user->notify( new NotifyAboutResumeSub( $userData ) );
        }

        return [
            "success" => true,
            "message" => "Your subscription has been resumed"
        ];
    }

    public function createManualSubscription($code) {

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

    }
}
