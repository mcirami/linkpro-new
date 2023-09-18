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

        $customerID = $this->user->braintree_id;
        $subscription = $this->getUserSubscriptions($this->user) ? : null;
        $paymentMethod = $this->user->pm_type ? : null;
        $paymentMethodToken = null;

        if($customerID == "bypass") {
            $token = null;
        } else {
           $gateway = $this->createGateway();

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
        }

        $data = [
            'user' => $this->user,
            'subscription' => $subscription,
            'payment_method' => $paymentMethod,
            'token' => $token,
            'payment_method_token' => $paymentMethodToken
        ];

        return $data;
    }

    /*
     * Update user password and/or email
     *
     * @return void
     *
     */

    public function updateUserInfo($request, $user) {


        if ($request->password) {
            $this->user->password = Hash::make($request->password);
        }

        $this->user->email = $request->email;

        $this->user->save();
    }

    public function updateCard($request) {

        $customerID = $this->user->braintree_id;

        $gateway = $this->createGateway();

        $customer = $gateway->customer()->find($customerID);

        if ($customer) {

            $token = $customer->paymentMethods[0]->token;

            $result = $gateway->customer()->update(
                $customerID,
                [
                    'paymentMethodNonce' => $request->payment_method_nonce,
                    'creditCard' => [
                        'options' => [
                            'updateExistingToken' => $token
                        ],
                        'billingAddress' => [
                            'postalCode' => '63304',
                            'options' => [
                                'updateExisting' => true
                            ]
                        ]
                    ],

                ]
            );


            if ($result->success) {

                $this->user->pm_last_four = $result->customer->paymentMethods[0]->last4;
                $this->user->save();

            } else {
                $errorString = "";

                foreach ($result->errors->deepAll() as $error) {
                    $errorString .= 'Error: ' . $error->code . ": " . $error->message . "\n";
                }

                return back()->withErrors('An error occurred with the message: '. $result->message);
            }

        } else {

            foreach($customer->errors->deepAll() AS $error) {
                echo($error->code . ": " . $error->message . "\n");
            }

            return back()->withErrors('An error occurred with the message: '. $customer->message);
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

            } else {
                foreach($result->errors->deepAll() AS $error) {
                    echo($error->code . ": " . $error->message . "\n");
                }

                return back()->withErrors('An error occurred with the message: '. $result->message);
            }

        } else {

            foreach($updateResult->errors->deepAll() AS $error) {
                echo($error->code . ": " . $error->message . "\n");
            }

            return back()->withErrors('An error occurred with the message: '. $updateResult->message);
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
