<?php

namespace App\Http\Controllers;

use App\Services\SubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Traits\BillingTrait;
use Inertia\Inertia;
use Inertia\Response;
use Stripe\Exception\ApiErrorException;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
class SubscriptionController extends Controller
{
    use BillingTrait;


    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws ApiErrorException
     */
    public function showPurchasePage(Request $request, SubscriptionService $subscriptionService): \Symfony\Component\HttpFoundation\Response {

        $checkout_session = $subscriptionService->getPurchasePage($request);

        return Inertia::location($checkout_session->url);
    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return void
     */
    public function stripeSubscribeSuccess(Request $request, SubscriptionService $subscriptionService): void {

        $data = $subscriptionService->getStripeSuccessPage($request);

        $subscriptionService->newStripeSubscription($data);

        $this->showSuccessPage(null, 'subscription', $data['customerName']);
    }

    public function cancelCheckout(): Response {
        return Inertia::render('Checkout/CancelCheckout')->with(['type' => 'subscription']);
    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return JsonResponse
     */
    public function changePlan(Request $request, SubscriptionService $subscriptionService): JsonResponse {

        $plan = $request->get('plan');
        $user = Auth::user();
        $defaultPage = $request->get('defaultPage') ? $request->get('defaultPage') : null;
        $url = '/dashboard';

        $subscriptionService->updateGateway($user, $request);

        $data = $subscriptionService->updateSubscription( $plan, $defaultPage );

        $path = $request->session()->get( '_previous' );
        if ( ( str_contains( $path["url"], '/subscribe' ) || str_contains( $path["url"], '/plans' ) ) ) {
            $page = $user->pages()->where( 'user_id', $user["id"] )->where( 'default', true )->first();
            $url  = '/dashboard/pages/' . $page->id;
        }

        return response()->json(['success' => $data["success"], 'message' => $data["message"], 'url' => $url, 'path' => $path]);

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
     * @return JsonResponse
     */
    public function cancel(Request $request, SubscriptionService $subscriptionService): JsonResponse {

        $gatewayData = $subscriptionService->cancelGateway($request);

        $data = $subscriptionService->cancelSubscription($gatewayData);

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
     * @return JsonResponse
     */
    public function resume(Request $request, SubscriptionService $subscriptionService): JsonResponse {

        $data = $subscriptionService->resumeGateway($request);

        $data = $subscriptionService->resumeSubscription($data);

        return response()->json([
            'success' => $data["success"],
            'message' => $data["message"],
        ]);
    }

    /**
     * @param Request|null $request
     * @param $type
     * @param $name
     *
     * @return Response
     */
    public function showSuccessPage(Request $request = null, $type = null, $name = null): Response {

        if(isset($request->type)) {
            $type = $request->type;
        }

        return Inertia::render('Checkout/Success')->with(['type' => $type, 'name' => $name ]);
    }

    public function payPalSubscribeSuccess(Request $request, SubscriptionService $subscriptionService) {
        /*
         * 'order_id' : data.orderID,
            'sub_id' : data.subscriptionID,
            'payment_type' : data.paymentSource
         *
         * */

        $subscriptionService->newPayPalSubscription($request);

        return response()->json([
            'success' => true,
        ]);

    }

    public function payPalCancel(Request $request) {
        dd($request);
    }
}
