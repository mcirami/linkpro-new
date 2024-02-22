<?php

namespace App\Http\Controllers;

use App\Services\SubscriptionService;
use Illuminate\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Auth;
use App\Http\Traits\SubscriptionTrait;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Stripe\Exception\ApiErrorException;
use Stripe\StripeClient;

class SubscriptionController extends Controller
{
    use SubscriptionTrait;

    /**
     *
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws ApiErrorException
     */
    public function showPurchasePage(): \Symfony\Component\HttpFoundation\Response {

        $stripe = new StripeClient(env('STRIPE_SECRET'));
        $plan = $_GET["plan"] ?? null;
        $lineItems = $this->getPlanDetails($plan);
        $user = Auth::user();
        $domain = request()->schemeAndHttpHost();

        $checkout_session = $stripe->checkout->sessions->create([
            'success_url'   => $domain . '/subscribe/success?session_id={CHECKOUT_SESSION_ID}&plan='. $plan,
            'cancel_url'    => $domain . '/subscribe/cancel-checkout',
            'line_items'    => [
                [
                    'price'     => $lineItems['ApiId'],
                    'quantity'  => 1
                ]
            ],
            'mode'                      => 'subscription',
            'customer_email'            => $user->email,
        ]);

        return Inertia::location($checkout_session->url);
    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return Response
     */
    public function subscribeSuccess(Request $request, SubscriptionService $subscriptionService): \Inertia\Response {

        $stripe = new StripeClient(env('STRIPE_SECRET'));
        $customer = "";
        try {
            $plan           = $_GET["plan"] ?? null;
            $sessionId      = $stripe->checkout->sessions->retrieve($_GET['session_id']);
            $customer       = $stripe->customers->retrieve($sessionId->customer);
            $paymentMethods = $stripe->customers->allPaymentMethods($customer->id, ['limit' => 1]);

            $paymentType    = $paymentMethods->data[0]->type;
            $last4          = null;
            if($paymentMethods->data[0]->type == "card") {
                $last4 = $paymentMethods->data[0]->card->last4;
            }

            $data = [
                'planId'        => $plan,
                'subId'         => $sessionId->subscription,
                'status'        => $sessionId->status,
                'customerId'    => $customer->id,
                'paymentType'   => $paymentType,
                'last4'         => $last4
            ];

            $subscriptionService->newSubscription($data);

            http_response_code(200);

        } catch ( ApiErrorException $e ) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }

        return Inertia::render('Subscription/Success')->with([ 'name' => $customer->name ]);

        /*
        $newData = null;
        if(array_key_exists("bypass", $data) && $data["bypass"]) {
            $newData = $subscriptionService->createManualSubscription($request->discountCode);
        }*/
    }

    public function cancelCheckout(): Response {
        return Inertia::render('Subscription/CancelCheckout');
    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return JsonResponse
     */
    public function changePlan(Request $request, SubscriptionService $subscriptionService): JsonResponse {

        $stripe = new StripeClient(env('STRIPE_SECRET'));
        $plan = $request->plan;
        $price = $this->getPlanDetails($plan);

        try {
            $stripe->subscriptions->update(
                $request->subId,
                [ 'price' => $price['ApiId'] ]
            );

        } catch ( ApiErrorException $e ) {
            http_response_code(500);
            //$this->saveErrors($e);
            echo json_encode(['error' => $e->getMessage()]);
        }

        $data = $subscriptionService->updateSubscription( $plan );

        $path = $request->session()->get( '_previous' );

        $url = null;

        if ( ( str_contains( $path["url"], '/subscribe' ) || str_contains( $path["url"], '/plans' ) ) ) {
            $user = Auth::user();
            $page = $user->pages()->where( 'user_id', $user["id"] )->where( 'default', true )->first();
            $url  = '/dashboard/pages/' . $page->id;
            //return Inertia::location($url)->with(['message' => $data["message"]]);
        }

        return response()->json(['success' => $data["success"], 'message' => $data["message"], 'url' => $url]);

    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return Response
     */
    public function showPlans(Request $request, SubscriptionService $subscriptionService): Response {

        $path = $request->session()->get('_previous');

        return Inertia::render('Plans/Plans')->with([ 'path' => $path["url"] ]);
    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function cancel(Request $request, SubscriptionService $subscriptionService): \Illuminate\Http\JsonResponse {

        $data = $subscriptionService->cancelSubscription($request);

        return response()->json([
            'success' => $data["success"],
            'message' => $data["message"],
            'ends_at' => array_key_exists('ends_at', $data) ? $data["ends_at"] : null,
        ]);
    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return mixed
     */
    public function resume(Request $request, SubscriptionService $subscriptionService) {

        $data = $subscriptionService->resumeSubscription($request);

        if (array_key_exists('bypass', $data) && $data["bypass"]) {

            $newData = $subscriptionService->updateSubscriptionManually($request->discountCode);

            $user = Auth::user();
            $page = $user->pages()->where('user_id', $user["id"])->where('default', true)->first();

            if($newData["success"]) {
                $url = '/dashboard/pages/' . $page->id;
                return Inertia::location($url)->with(['message' => $newData["message"]]);
            }
        }

        return response()->json([
            'success' => $data["success"],
            'message' => $data["message"],
        ]);
    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return JsonResponse
     */
    public function checkCode(Request $request, SubscriptionService $subscriptionService): \Illuminate\Http\JsonResponse {

        $planID = $request->planId;
        $code = $request->code;

        $match = $this->checkPromoCode($planID, $code);

        $data = $subscriptionService->getCodeReturnMessage($match, $planID, $code);

        return response()->json(['success' => $data["success"],'message' => $data["message"]]);

    }
}
