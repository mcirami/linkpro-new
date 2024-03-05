<?php /** @noinspection PhpVoidFunctionResultUsedInspection */

/** @noinspection MissingParameterTypeDeclarationInspection */


namespace App\Services;

use App\Notifications\NotifyAboutUnsubscribe;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Traits\BillingTrait;
use App\Http\Traits\UserTrait;

class UserService {

    use BillingTrait, UserTrait;

    private $user;

    /**
     *
     */
    public function __construct() {
        $this->user = Auth::user();

        return $this->user;
    }

    /**
     * @return array
     */
    public function getUserInfo(): array {

        $subscription = $this->getUserSubscriptions($this->user) ? : null;
        $paymentMethod = $this->user->pm_type ? : null;

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

    public function updateUserInfo($request): void {

        if ($request->password) {
            $this->user->password = Hash::make($request->password);
        }

        if ($request->email) {
            $this->user->email = $request->email;
        }

        $this->user->save();
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
