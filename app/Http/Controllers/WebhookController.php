<?php

namespace App\Http\Controllers;

use App\Services\WebhookService;
use Illuminate\Support\Facades\Log;
use App\Http\Traits\BillingTrait;
use Stripe\Webhook;

class WebhookController extends Controller
{

    use BillingTrait;

    public function receiveWebhookResponse(WebhookService $webhook_service): void {

        $stripe = $this->createGateway();
        $endpointSecret = env('STRIPE_WEBHOOK_SECRET');
        $payload = @file_get_contents('php://input');
        $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
        $event = null;
        $response = null;
        try {
            $event = Webhook::constructEvent(
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
                $subId      = $event->data->object->id;
                $productId  = $event->data->object->plan->product;
                $endDate    = $event->data->object->cancel_at;

                if($endDate) {
                    $webhook_service->cancelSubscription($subId, $endDate);
                } else {
                    $webhook_service->updateSubscription($subId, $productId);
                }

                $response = "customer.subscription.updated: " . $event->data->object;
                break;
            case 'customer.subscription.deleted':
                $subId      = $event->data->object->id;
                $productId  = $event->data->object->plan->product;
                $webhook_service->handleSubscriptionEnded($subId, $productId);

                $response = "customer.subscription.deleted: " . $event->data->object;
                break;
            case 'payment_method.attached':
                $customer =  $event->data->object->customer;
                $webhook_service->checkDefaultPaymentMethod($customer);
                $response = "payment_method.attached: " . $event->data->object;
                break;
            default:
                $response = 'Received unknown event type ' . $event->type . '---object---' . $event->data->object;
                break;
        }
        http_response_code(200);
        if ($response) {
            Log::channel( 'webhooks' )->info( " --- object --- " . $response );
        }


    }
}
