<?php

namespace App\Services;
use App\Http\Traits\BillingTrait;
use App\Http\Traits\UserTrait;
use App\Notifications\NotifyAboutUpgrade;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
use Throwable;

class PayPalService {

    use BillingTrait, UserTrait;

    private mixed $user;

    /**
     * @param $user
     */
    public function __construct($user = null) {
        $this->user = $user ?: Auth::user();
        return $this->user;
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
            'pm_type'       => $data['pmType'],
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
     * @param $endpoint
     * @param array|string $sendData
     *
     * @throws Throwable
     */
    public function payPalPostCall($endpoint, array|string $sendData = []): void {

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
    public function payPalGetCall($endpoint, $type) {
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
}