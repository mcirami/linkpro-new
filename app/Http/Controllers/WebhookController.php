<?php

namespace App\Http\Controllers;

use App\Services\WebhookService;
use Illuminate\Support\Facades\Log;
use App\Http\Traits\SubscriptionTrait;

class WebhookController extends Controller
{

    use SubscriptionTrait;

    /**
     * @param WebhookService $webhookService
     *
     * @return void
     * @throws \Braintree\Exception\InvalidSignature
     */
    public function chargedSuccessfully(WebhookService $webhookService) {

        $gateway = $this->createGateway();

        /**for testing **/
        //$webhookService->webhookTest($gateway, 'SUBSCRIPTION_CHARGED_SUCCESSFULLY');

        if (
            isset($_POST["bt_signature"]) &&
            isset($_POST["bt_payload"])
        ) {
            $notification = $gateway->webhookNotification()->parse(
                $_POST["bt_signature"],
                $_POST["bt_payload"]
            );

            $webhookService->charged($notification);
        }
    }

    public function subWentActive(WebhookService $webhookService) {

        $gateway = $this->createGateway();

        /**for testing **/
        //$webhookService->webhookTest($gateway, 'SUBSCRIPTION_WENT_ACTIVE');

        if (
            isset($_POST["bt_signature"]) &&
            isset($_POST["bt_payload"])
        ) {
            $notification = $gateway->webhookNotification()->parse(
                $_POST["bt_signature"],
                $_POST["bt_payload"]
            );

            $webhookService->wentActive($notification);
        }
    }
}
