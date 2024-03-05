<?php

namespace App\Http\Controllers;

use App\Services\WebhookService;
use Illuminate\Support\Facades\Log;
use App\Http\Traits\BillingTrait;

class WebhookController extends Controller
{

    use BillingTrait;

    public function receiveWebhookResponse() {

        $stripe = $this->createGateway();
        $endpointSecret = 'whsec_f1fa432dd86ab3b8112399a82dfac58c8bf5c323a96e5a5ed2d1af6713ef7ddb';
        $payload = @file_get_contents('php://input');
        $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
        $event = null;
        $response = null;
        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload, $sig_header, $endpointSecret
            );
        } catch(\UnexpectedValueException $e) {
            // Invalid payload
            http_response_code(400);
            exit();
        } catch(\Stripe\Exception\SignatureVerificationException $e) {
            // Invalid signature
            http_response_code(400);
            exit();
        }

        switch($event->type) {
            case 'customer.subscription.updated':
                $response = $event->data->object;
                break;
            default:
                $response = 'Received unknown event type ' . $event->type;
                break;
        }

        Log::channel( 'webhooks' )->info( " --- object --- " . $response );

    }
}
