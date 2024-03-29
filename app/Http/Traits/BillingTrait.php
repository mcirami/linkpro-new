<?php

namespace App\Http\Traits;
use App\Models\Referral;
use Illuminate\Support\Facades\DB;
use Stripe\Exception\ApiErrorException;
use Stripe\StripeClient;

trait BillingTrait {


    /**
     * @return StripeClient
     */
    public function createGateway(): StripeClient {

        return new StripeClient(env('STRIPE_SECRET'));

    }

    /**
     * @param $planName
     *
     * @return array|string[]
     */
    public function getPlanDetails($planName): array {

        $priceId = DB::table('plans')->where('name', '=', $planName)->pluck('price_id')->first();

        return [
            'ApiId'  => $priceId
        ];
    }

    /**
     * @param $request
     *
     * @return array
     */
    public function getCustomerBillingInfo($request): array {

        try {
            $stripe     = $this->createGateway();
            $session    = $stripe->checkout->sessions->retrieve(
                $request->session_id,
                ['expand' => ['customer']]
            );
            $customer      = $session->customer;
            $paymentMethod = $stripe->customers->allPaymentMethods( $customer->id, [ 'limit' => 1 ] );

            $last4  = null;
            $pmType = null;
            $pmId = null;
            if ( !empty($paymentMethod) ) {
                if( $paymentMethod->type == "card" ) {
                    $last4 = $paymentMethod->card->last4;
                }

                $pmType = $paymentMethod->type;
                $pmId = $paymentMethod->id;
            }

            $data = [
                'id'        => $customer->id,
                'name'      => $customer->name,
                'last4'     => $last4,
                'pmType'    => $pmType,
                'pmId'      => $pmId,
                'invoice'   => $session->invoice,
                'status'    => $session->status == "complete" ? "active" : $session->status,
                'subId'     => $session->subscription
            ];

        } catch ( ApiErrorException $e ) {
            $this->saveErrors($e);
            http_response_code(500);
            $data = [
                "success" => false,
                "message" => 'An error occurred with the message: ' . $e
            ];
            //echo json_encode(['error' => $e->getMessage()]);
        }

        return $data;

    }

    /**
     * @param $error
     *
     * @return void
     *
     * TODO: check handling errors with stripe
     */
    public function saveErrors($error): void {
        DB::table('transaction_errors')->insert([
            'code'          => $error->getCode(),
            'message'       => $error->getMessage(),
            'attribute'     => $error->getStripeCode(),
        ]);
    }
}
