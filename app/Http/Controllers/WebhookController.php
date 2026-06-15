<?php

namespace App\Http\Controllers;

use App\Models\ProcessedWebhookEvent;
use App\Services\PayPalService;
use App\Services\WebhookService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;

class WebhookController extends Controller
{
    /**
     * Subscription / customer related Stripe events.
     */
    public function receiveWebhookResponse(Request $request, WebhookService $webhook_service): Response
    {
        return $this->handleStripeWebhook($request, 'customer', function ($event) use ($webhook_service) {
            switch ($event->type) {
                case 'customer.subscription.updated':
                    $subId     = $event->data->object->id;
                    $productId = $event->data->object->plan->product;
                    $endDate   = $event->data->object->cancel_at;

                    if ($endDate) {
                        $webhook_service->cancelSubscription($subId, $endDate);
                    } else {
                        $webhook_service->updateSubscription($subId, $productId);
                    }
                    break;
                case 'customer.subscription.deleted':
                    $webhook_service->handleSubscriptionEnded(
                        $event->data->object->id,
                        $event->data->object->plan->product,
                        null
                    );
                    break;
                case 'customer.updated':
                    $defaultPaymentId = $event->data->object->invoice_settings->default_payment_method;
                    if ($defaultPaymentId) {
                        $webhook_service->updateDefaultPaymentMethod($defaultPaymentId, $event->data->object->id);
                    }
                    break;
                case 'payment_method.attached':
                    $webhook_service->checkDefaultPaymentMethod($event->data->object->customer);
                    break;
            }
        });
    }

    /**
     * Product / plan related Stripe events.
     */
    public function receiveProductWebhookResponse(Request $request, WebhookService $webhook_service): Response
    {
        return $this->handleStripeWebhook($request, 'product', function ($event) use ($webhook_service) {
            switch ($event->type) {
                case 'product.created':
                    $webhook_service->addPlan($event->data->object);
                    break;
                case 'product.deleted':
                    $webhook_service->deletePlan($event->data->object);
                    break;
                case 'product.updated':
                    $webhook_service->updatePlan($event->data->object);
                    break;
            }
        });
    }

    public function receivePaypalWebhookResponse(Request $request, WebhookService $webhook_service, PayPalService $payPalService): Response
    {
        if (!$payPalService->verifyWebhookSignature($request)) {
            Log::channel('webhooks')->warning('Rejected PayPal webhook with invalid signature.', [
                'transmission_id' => $request->header('PAYPAL-TRANSMISSION-ID'),
                'event_type'      => $request->input('event_type'),
            ]);
            return response('Invalid signature', 400);
        }

        $webhookData     = $request->all();
        $eventId         = $webhookData['id'] ?? null;
        $event_type      = $webhookData['event_type'] ?? null;
        $resource        = $webhookData['resource'] ?? [];
        $subscription_id = $resource['id'] ?? null;
        $endDate         = $resource['start_time'] ?? null;
        $plan_id         = $resource['plan_id'] ?? null;

        // Skip events PayPal has already delivered and we've handled.
        if ($eventId && !ProcessedWebhookEvent::claim('paypal', $eventId, $event_type)) {
            Log::channel('webhooks')->info('Duplicate PayPal webhook ignored', ['event_id' => $eventId]);
            return response('', 200);
        }

        if (App::environment() === 'production') {
            $planName = $plan_id == 'P-6MH1893903516972EMX5QADY' ? 'pro' : 'premier';
        } else {
            $planName = $plan_id == 'P-5XM03253A6686724NMYGYLEQ' ? 'pro' : 'premier';
        }

        Log::channel('webhooks')->info('PayPal webhook received', ['event_type' => $event_type, 'event_id' => $eventId]);

        switch ($event_type) {
            case 'BILLING.SUBSCRIPTION.CANCELLED':
                $webhook_service->cancelSubscription($subscription_id, $endDate);
                break;
            case 'BILLING.SUBSCRIPTION.EXPIRED':
                $webhook_service->handleSubscriptionEnded($subscription_id, null, $planName);
                break;
        }

        return response('', 200);
    }

    /**
     * Verify a Stripe webhook, guard against duplicate delivery, then run the
     * given handler. The event is claimed before processing so concurrent
     * redeliveries can't both run; the claim is released if the handler throws
     * so Stripe's retry can reprocess it.
     */
    private function handleStripeWebhook(Request $request, string $type, callable $handler): Response
    {
        $event = $this->constructStripeEvent($request, $type);

        if (!$event) {
            return response('Invalid payload or signature', 400);
        }

        if (!ProcessedWebhookEvent::claim('stripe', $event->id, $event->type)) {
            Log::channel('cloudwatch')->info('Duplicate Stripe webhook ignored', [
                'event_id' => $event->id,
                'type'     => $event->type,
            ]);
            return response('', 200);
        }

        try {
            $handler($event);
        } catch (\Throwable $e) {
            ProcessedWebhookEvent::where('provider', 'stripe')->where('event_id', $event->id)->delete();
            Log::channel('cloudwatch')->error('Stripe webhook handler failed', [
                'event_id' => $event->id,
                'type'     => $event->type,
                'error'    => $e->getMessage(),
            ]);
            throw $e;
        }

        Log::channel('cloudwatch')->info('Processed Stripe webhook', [
            'event_id' => $event->id,
            'type'     => $event->type,
        ]);

        return response('', 200);
    }

    /**
     * Construct and verify a Stripe event from the request, or null if the
     * payload/signature is invalid.
     */
    private function constructStripeEvent(Request $request, string $type): ?\Stripe\Event
    {
        try {
            return Webhook::constructEvent(
                $request->getContent(),
                $request->header('Stripe-Signature', ''),
                $this->stripeWebhookSecret($type)
            );
        } catch (\UnexpectedValueException | \Stripe\Exception\SignatureVerificationException $e) {
            Log::channel('cloudwatch')->warning('Invalid Stripe webhook rejected', [
                'webhook' => $type,
                'error'   => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Resolve the signing secret for the given webhook + environment.
     */
    private function stripeWebhookSecret(string $type): ?string
    {
        $production = App::environment() == 'production';

        if ($type == 'customer') {
            return $production
                ? config('services.stripe.webhook_secret')
                : config('services.stripe.test_webhook_secret');
        }

        return $production
            ? config('services.stripe.product_webhook_secret')
            : config('services.stripe.test_product_webhook_secret');
    }
}
