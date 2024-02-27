<?php /** @noinspection PhpVoidFunctionResultUsedInspection */

/** @noinspection MissingParameterTypeDeclarationInspection */


namespace App\Services;

use App\Models\User;
use App\Notifications\NotifyAboutUnsubscribe;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;
use App\Http\Traits\SubscriptionTrait;
use App\Http\Traits\UserTrait;

class UserService {

    use SubscriptionTrait, UserTrait;

    private $user;

    /**
     * @return $user
     */
    public function __construct() {
        $this->user = Auth::user();

        return $this->user;
    }

    public function getUserInfo() {

        $subscription = $this->getUserSubscriptions($this->user) ? : null;
        $paymentMethod = $this->user->pm_type ? : null;

        /*if($customerID == "bypass") {
            $token = null;
        } else {
           $stripe = $this->createGateway();

            if ( $customerID ) {
                $token = $gateway->ClientToken()->generate( [
                    'customerId' => $customerID
                ] );

                if ( $subscription->ends_at && $subscription->ends_at > Carbon::now() ) {

                    $customer = $gateway->customer()->find( $customerID );

                    foreach ( $customer->paymentMethods as $payment_method ) {
                        if ( $payment_method->default ) {
                            $paymentMethodToken = $payment_method->token;
                        }
                    }
                }

            } else {
                $token = $gateway->ClientToken()->generate();
            }
        }*/

        return [
            'user'                  => $this->user,
            'subscription'          => $subscription,
            'payment_method'        => $paymentMethod,
        ];
    }

    /*
     * Update user password and/or email
     *
     * @return void
     *
     */

    public function updateUserInfo($request) {

        if ($request->password) {
            $this->user->password = Hash::make($request->password);
        }

        if ($request->email) {
            $this->user->email = $request->email;
        }

        $this->user->save();
    }

    public function updateCard($request) {

        $customerID = $this->user->braintree_id;

        $gateway = $this->createGateway();

        $customer = $gateway->customer()->find($customerID);

        if ($customer) {

            $token = $customer->paymentMethods[0]->token;

            /*$result = $gateway->customer()->update(
                $customerID,
                [
                    'paymentMethodNonce' => $request->payment_method_nonce,
                    'creditCard' => [
                        'options' => [
                            'updateExistingToken'   => $token,
                        ],
                        'billingAddress' => [
                            'postalCode' => $request->postalCode,
                            'options' => [
                                'updateExisting' => true
                            ]
                        ]
                    ]
                ]
            );*/

            $result = $gateway->paymentMethod()->update($token, [
                'paymentMethodNonce' => $request->payment_method_nonce,

            ]);

            if ($result->success) {

                $pmLastFour = $result->customer->paymentMethods[0]->last4;

                $this->user->pm_last_four = $pmLastFour;
                $this->user->save();

                return [
                    'success'       => true,
                    'message'       => "Credit Card Updated",
                ];

            } else {
                $errorString = "";

                foreach ($result->errors->deepAll() as $error) {
                    $errorString .= 'Error: ' . $error->code . ": " . $error->message . "\n";
                }

                return [
                    'success'    => 'false',
                    'message'   => 'An error occurred with the fucking message: '. $result->message,
                ];
                //return back()->withErrors('An error occurred with the message: '. $errorString);
            }

        } else {

            foreach($customer->errors->deepAll() AS $error) {
                echo($error->code . ": " . $error->message . "\n");
            }

            return response()->json(['success' => false, 'error' => 'An error occurred with the message: '. $customer->message]);
            //return back()->withErrors('An error occurred with the message: '. $customer->message);
        }
    }

    public function updatePaymentMethod($request) {

        $customerID = $this->user->braintree_id;

        $gateway = $this->createGateway();

        $updateResult = $gateway->paymentMethod()->create([
            'customerId' => $customerID,
            'paymentMethodNonce' => $request->payment_method_nonce,
            'options' => [
                'makeDefault' => true
            ]
        ]);

        if ($updateResult->success) {

            $paymentToken = $updateResult->paymentMethod->token;
            $subscription = $this->getUserSubscriptions($this->user);

            $result = $gateway->subscription()->update($subscription->braintree_id, [
                'paymentMethodToken' => $paymentToken,
            ]);

            if ($result->success) {

                $paymentMethod = $request->pm_type;

                if ( $request->pm_last_four ) {
                    $this->user->pm_last_four = $request->pm_last_four;
                } else {
                    $this->user->pm_last_four = null;
                }

                $this->user->pm_type = $paymentMethod;
                $this->user->save();

                return [
                    'success'       => true,
                    'message'       => "Payment Method Changed",
                ];

            } else {
                foreach($result->errors->deepAll() AS $error) {
                    echo($error->code . ": " . $error->message . "\n");
                }

                return [
                    'success'    => 'false',
                    'message'   => 'An error occurred with the fucking message: '. $result->message,
                ];
                //return back()->withErrors('An error occurred with the message: '. $result->message);
            }

        } else {

            foreach($updateResult->errors->deepAll() AS $error) {
                echo($error->code . ": " . $error->message . "\n");
            }
            return response()->json(['success' => false, 'error' => 'An error occurred with the message: '. $updateResult->message]);
            //return back()->withErrors('An error occurred with the message: '. $updateResult->message);
        }

    }

    public function handleEmailSubscription($user) {

        $action = $_GET["action"];

       if ($action == "unsubscribe") {
           $user->email_subscription = false;
           $user->save();

           $data = [
               "subscribed" => false,
               "message" => "You have been unsubscribed from our email notifications..."
           ];

           $userData = ([
               'subject' => 'You have been UnSubscribed',
               'userID'  => $user->id,
           ]);

           $user->notify(new NotifyAboutUnsubscribe($userData));

       } else {
           $user->email_subscription = true;
           $user->save();

           $data = [
               "subscribed" => true,
               "message" => "Thank you for subscribing!"
           ];
       }

       return $data;

    }
}
