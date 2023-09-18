<?php


namespace App\Services;

use App\Http\Controllers\Controller;
use App\Notifications\NotifyAboutCancelation;
use App\Notifications\NotifyAboutResumeSub;
use App\Notifications\NotifyAboutUpgrade;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Http\Traits\SubscriptionTrait;
use App\Http\Traits\UserTrait;
use Braintree\Exception;
use Illuminate\Support\Facades\DB;

class SubscriptionService {

    use SubscriptionTrait, UserTrait;

    private $user;

    /**
     * @param $user
     */
    public function __construct() {
        $this->user = Auth::user();

        return $this->user;
    }

    /**
     *
     * Get subscription information to purchase and generate client token
     *
     * @return array
     */
    public function showPurchasePage() {

        $activeSubs = $this->getUserSubscriptions($this->user);
        $bypass = null;

        if (empty($activeSubs)) {
            $existing = null;
        } elseif ($activeSubs->braintree_id == "bypass") {
            $existing = null;
            $bypass = true;
        } else {
            $existing = true;
        }

        $gateway = $this->createGateway();

        $customerID = $this->user->braintree_id;

        if ($customerID && $customerID != "bypass") {
            $token = $gateway->ClientToken()->generate([
                'customerId' => $customerID
            ]);
        } else {
            $token = $gateway->ClientToken()->generate();
        }

        $plan = isset($_GET["plan"]) ? $_GET["plan"] : null;

        $price = $this->getPlanDetails($plan);

        $data = [
            'plan' => $plan,
            'token' => $token,
            'price' => $price,
            'existing' => $existing,
            'bypass' => $bypass
        ];

        return $data;
    }

    /**
     * Check if user has subscription and return current if true
     *
     * @return mixed|null
     */
    public function showPlansPage() {

        $subscription = $this->getUserSubscriptions($this->user);

        if (empty($subscription)) {
            $subscription = null;
        }

        return $subscription;
    }

    /**
     * create new user Braintree customer and subscription
     *
     *
     * @param $request
     *
     * @return array
     */
    public function newSubscription($request) {

        $code     = null;
        $userCode = $request->discountCode;
        $planID   = $request->planId;

        if ( $userCode ) {

            $code = $this->checkPromoCode($planID, $userCode);

            if (!$code) {

                return [
                    "success" => false,
                    "message" => "Promo Code is Not Valid"
                ];

            } elseif ($code == "bypass") {

                return [
                    "success" => false,
                    "bypass" => true,
                ];
            }
        }

        $gateway = $this->createGateway();

        $nonce = $request->payment_method_nonce;

        $customer = $gateway->customer()->create( [
            'email'              => $this->user->email,
            'paymentMethodNonce' => $nonce
        ] );

        if ( $customer->success ) {

            if ( $code ) {
                $result = $gateway->subscription()->create( [
                    'paymentMethodToken' => $customer->customer->paymentMethods[0]->token,
                    'planId'             => $planID,
                    'discounts'          => [
                        'add' => [
                            [
                                'inheritedFromId' => $code,
                            ]
                        ]
                    ]
                ] );
            } else {
                $result = $gateway->subscription()->create( [
                    'paymentMethodToken' => $customer->customer->paymentMethods[0]->token,
                    'planId'             => $planID,
                ] );
            }

            if ( $result->success ) {

                $subscription = $this->user->subscriptions()->create( [
                    'name'             => $result->subscription->planId,
                    'braintree_id'     => $result->subscription->id,
                    'braintree_status' => strtolower( $result->subscription->status ),
                ] );

                //$this->addReferralSubID($this->user, $subscription->id, $result->subscription->planId);

                $paymentMethod = strtolower( get_class( $customer->customer->paymentMethods[0] ) );
                //$paymentMethod = $result->subscription->transactions[0]->paymentInstrumentType;

                if (str_contains($paymentMethod, "credit") ) {
                    //$paymentMethod = $customer->customer->paymentMethods[0]->cardType;
                    $this->user->pm_last_four = $customer->customer->paymentMethods[0]->last4;
                } else {
                    $this->user->pm_last_four = null;
                }

                $this->user->pm_type      = $paymentMethod;
                $this->user->braintree_id = $customer->customer->id;
                $this->user->save();

                if ($this->user->email_subscription) {

                    $userData = ( [
                        'plan'    => ucfirst($request->level),
                        'userID'  => $this->user->id,
                    ] );

                    $this->user->notify( new NotifyAboutUpgrade( $userData ) );
                }

                $data = [
                    "success" => true,
                    "message" => "Your plan has been changed to the " . $request->level . " level"
                ];

            } else {
                $this->saveErrors($result);

                $data = [
                    "success" => false,
                    "message" => 'An error occurred with the message: ' . $result->message
                ];
            }

        } else {
            $this->saveErrors($customer);

            $data = [
                "success" => false,
                "message" => 'An error occurred with the message: ' . $customer->message
            ];
        }

        return $data;

    }

    /**
     *
     * Update user subscription level
     *
     * @param $request
     *
     * @return array
     */
    public function updateSubscription($request) {

        $activeSubs = $this->getUserSubscriptions($this->user);

        if ($activeSubs->braintree_id == "bypass") {

            $activeSubs->update( [ 'name' => "premier" ] );

            $data = [
                "success" => true,
                "message" => "Your plan has been upgraded to the Premier level"
            ];

        } else {
            $gateway = $this->createGateway();

            $planId = $request->level;
            $price = $this->getPlanDetails($planId);

            $result = $gateway->subscription()->update( $activeSubs->braintree_id, [
                'price'  => $price,
                'planId' => $planId
            ] );

            if ( $result->success ) {
                $activeSubs->update( [ 'name' => $planId ] );

                $userPages = $this->getUserPages( $this->user );

                if ( count( $userPages ) > 1) {
                    foreach ( $userPages as $userPage ) {

                        if($planId == "premier") {
                            if ( $userPage->disabled ) {
                                $userPage->disabled = false;
                                $userPage->save();
                            }
                        }

                        if ($planId == "pro") {
                            if ( $userPage->is_protected ) {
                                $userPage->is_protected = 0;
                                $userPage->password     = null;
                            }

                            if ( $request->defaultPage ) {
                                if ( $request->defaultPage == $userPage->id ) {
                                    $userPage->default  = true;
                                    $userPage->disabled = false;
                                    $this->user->update( [ 'username' => $userPage->name ] );
                                } else {
                                    $userPage->default  = false;
                                    $userPage->disabled = true;
                                }
                            }

                            $userPage->save();
                        }
                    }

                    if($planId == "premier") {
                        if ( $this->user->email_subscription ) {

                            $userData = ( [
                                'plan'   => ucfirst( $planId ),
                                'userID' => $this->user->id,
                            ] );

                            $this->user->notify( new NotifyAboutUpgrade( $userData ) );
                        }

                        $data = [
                            "success" => true,
                            "message" => "Your plan has been upgraded to the Premier level"
                        ];
                    }

                    if ($planId == "pro") {
                        $data = [
                            "success" => true,
                            "message" => "Your plan has been downgraded to the Pro level"
                        ];
                    }
                }

            } else {
                $this->saveErrors($result);

                $data = [
                    "success" => false,
                    "message" => 'An error occurred with the message: ' . $result->message
                ];
            }
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
    public function cancelSubscription($request) {

        $plan = $request->plan;
        $gateway = $this->createGateway();

        try {

            $sub = $gateway->subscription()->find($plan);

            $update = null;

            if ($sub->currentBillingCycle != 0) {
                $update = $gateway->subscription()->update( $plan, [
                    'numberOfBillingCycles' => $sub->currentBillingCycle,
                ] );
            }

            if ( $update == null || $update->success) {

                $result = $gateway->subscription()->cancel($plan);

                if ($result->success) {

                    if ($result->subscription->billingPeriodEndDate) {
                        $billingEndDate = Carbon::create($result->subscription->billingPeriodEndDate);
                        $endDateDB = $billingEndDate->endOfDay();
                        $endDateMail = $result->subscription->billingPeriodEndDate->format( 'F j, Y' );
                    } else {
                        $nextBillingDate = Carbon::create($result->subscription->nextBillingDate->sub(new \DateInterval('P1D')));
                        $time = $nextBillingDate->endOfDay();
                        $endDateDB = $time->format('Y-m-d H:i:s');
                        $endDateMail = $time->format( 'F j, Y' );
                    }

                    $subscription = $this->getUserSubscriptions($this->user);
                    $subscription->braintree_status = strtolower($result->subscription->status);
                    $subscription->ends_at = $endDateDB;
                    $subscription->save();

                    if ($this->user->email_subscription) {

                        $userData = ( [
                            'end_date' => $endDateMail,
                            'userID'   => $this->user->id,
                        ] );

                        $this->user->notify( new NotifyAboutCancelation( $userData ) );
                    }

                    $data = [
                        "success" => true,
                        "message" => "Your Subscription Has Been Cancelled"
                    ];

                } else {
                    $errorString = "";

                    $this->saveErrors($result);

                    $data = [
                        "success" => false,
                        "message" => 'An error occurred with the message: '. $result->message
                    ];
                }
            } else {

                $this->saveErrors($update);

                $data = [
                    "success" => false,
                    "message" => 'An error occurred with the message: '. $update->message
                ];
            }

        } catch (Exception $e) {

            $errorString = explode('not found', $e );

            DB::table('transaction_errors')->insert([
                'code' => 'find plan error',
                'message' => $errorString[0],
                'attribute' => 'find plan error',
            ]);

            $data = [
                "success" => false,
                "message" => 'An error occurred with the message: '. $errorString[0]
            ];
        }

        return $data;

    }

    /**
     *
     * Resume subscription by creating new subscription and setting start date to previous subscription end date
     * If previous subscription has expired then create new subscription without end date
     *
     * @param $request
     *
     * @return array
     */
    public function resumeSubscription($request) {

        $activeSubs = $this->getUserSubscriptions($this->user);
        $planID   = $request->planId;
        $timestamp = NULL;
        $expired = false;
        $userCode = $request->discountCode;

        $gateway = $this->createGateway();

        if ($activeSubs->ends_at > Carbon::now()) {
            $token = $request->payment_method_token;
            $timestamp = strtotime($activeSubs->ends_at);
            $timestamp += 60*60*24;
            $billingDate = date('Y-m-d H:i:s', $timestamp);

            $result = $gateway->subscription()->create( [
                'paymentMethodToken' => $token,
                'planId'             => $planID,
                'firstBillingDate'  => $billingDate,
            ] );
        } else {

            $nonce = $request->payment_method_nonce ?: null;

            if ( $userCode ) {

                $code = $this->checkPromoCode($planID, $userCode);

                if ($code && $code != "bypass" ) {

                    $result = $gateway->subscription()->create( [
                        'paymentMethodNonce' => $nonce,
                        'planId'             => $planID,
                        'discounts'          => [
                            'add' => [
                                [
                                    'inheritedFromId' => $code,
                                ]
                            ]
                        ]
                    ] );

                } elseif ($code && $code == "bypass") {

                    return [
                        "success" => false,
                        "bypass" => true,
                    ];

                } else {

                    $data = [
                        "success" => false,
                        "message" => "Sorry, discount code does not match"
                    ];

                    return $data;

                }
            } else {
                $result = $gateway->subscription()->create( [
                    'paymentMethodNonce' => $nonce,
                    'planId'             => $planID,
                ] );
            }

            $expired = true;
        }

        if ( $result->success ) {

            $activeSubs->name             = $result->subscription->planId;
            $activeSubs->braintree_id     = $result->subscription->id;
            $activeSubs->braintree_status = strtolower( $result->subscription->status );
            $activeSubs->ends_at          = NULL;
            $activeSubs->save();

            if ($this->user->email_subscription) {

                $userData = ( [
                    'userID'  => $this->user->id,
                    'username' => $this->user->username,
                    'link' => $this->getDefaultUserPage($this->user)[0],
                    'billingDate' =>  $timestamp ? date('F j, Y', $timestamp) : null,
                ] );

                $this->user->notify( new NotifyAboutResumeSub( $userData ) );
            }

            if ($expired && $planID == 'premier') {
                $this->enableUsersPages($this->user);
            }

            $data = [
                "success" => true,
                "message" => "Your subscription has been resumed"
            ];

        } else {
            $this->saveErrors($result);

            $data = [
                "success" => false,
                "message" => 'An error occurred with the message: ' . $result->message
            ];
        }

        return $data;

    }

    public function createManualSubscription($code) {

        if (strtolower( $code ) == "freepremier") {
            $subName = "premier";
        } else {
            $subName = "pro";
        }

        $this->user->subscriptions()->create( [
            'name'             => $subName,
            'braintree_id'     => "bypass",
            'braintree_status' => "active",
        ] );

        $this->user->update(["braintree_id" => "bypass"]);

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
            'name'             => $subName,
            'braintree_id'     => "bypass",
            'braintree_status' => "active",
            'ends_at'          => null
        ] );

        $this->user->update(["braintree_id" => "bypass"]);

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

    public function getCodeReturnMessage($match, $planID, $code) {


        if ($match) {
            if ( $planID == "premier" && strtolower( $code ) == "6freepremier" ) {
                $message = "Congrats! Your 6 Month Premier Promo Code is activated!";
            } elseif ( $planID == "premier" && strtolower( $code ) == "1freepremier" ) {
                $message = "Congrats! Your 1 Month Premier Promo Code is activated!";
            } elseif($planID == "premier" && strtolower( $code ) == "freepremier") {
                $message = "Congrats! Your Lifetime Premier Promo Code is activated!";
            } elseif ( $planID == "pro" && strtolower( $code ) == "6freepro" ) {
                $message = "Congrats! Your 6 Month Pro Promo Code is activated!";
            } elseif ( $planID == "pro" && strtolower( $code ) == "1freepro" ) {
                $message = "Congrats! Your 1 Month Pro Promo Code is activated!";
            } elseif ( $planID == "pro" && strtolower( $code ) == "freepro" ) {
                $message = "Congrats! Your Lifetime Pro Promo Code is activated!";
            }

            $success = true;

        } else {
            if ( $planID == "premier" && (strtolower( $code ) == "6freepro" || strtolower( $code ) == "1freepro" || strtolower( $code ) == "freepro" )) {
                $message = "Sorry, your Promo Code is invalid. All promo codes entered MUST match the membership type.";
            } elseif ($planID == "pro" && (strtolower( $code ) == "6freepremier" || strtolower( $code ) == "1freepremier" || strtolower( $code ) == "freepremier" )) {
                $message = "Sorry, your Promo Code is invalid. All promo codes entered MUST match the membership type.";
            } else {
                $message = "Sorry, your Promo Code is invalid.";
            }
            $success = false;
        }

        return [
            "success" => $success,
            "message" => $message
        ];
    }
}
