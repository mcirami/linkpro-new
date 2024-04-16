<?php

namespace App\Http\Controllers;

use App\Services\SubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use App\Http\Traits\BillingTrait;
use Inertia\Inertia;
use Inertia\Response;
use Stripe\Exception\ApiErrorException;
use Throwable;

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
     * @return Response|void
     * @throws Throwable
     */
    public function stripeSubscribeSuccess(Request $request, SubscriptionService $subscriptionService) {

        $type = $request->get('type');

        $data = $subscriptionService->getStripeSuccessPage($request);

        if ($type == "change_payment_method") {
            $subscriptionService->updateUserPaymentMethod($data);
            $subscriptionService->cancelPayPalSubscription();
            $subscriptionService->updateUserSubDetails($data);
            return Inertia::render('User/User')->with(['message' => 'Payment Method Changed']);
        } else {
            $subscriptionService->newStripeSubscription($data);
            $this->showSuccessPage(null, 'subscription', $data['customerName']);
        }
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
        $pmType = $request->get('pmType') ?: null;
        $user = Auth::user();
        $defaultPage = $request->get('defaultPage') ?: null;
        $url = '/dashboard';

        if ($pmType && $pmType!= 'paypal') {
            $subscriptionService->updateGateway( $request );
        }

        $data = $subscriptionService->updateSubscription( $plan, $defaultPage );

        $path = $request->session()->get( '_previous' );
        if ( ( str_contains( $path["url"], '/subscribe' ) || str_contains( $path["url"], '/plans' ) ) ) {
            $page = $user->pages()->where( 'user_id', $user["id"] )->where( 'default', true )->first();
            $url  = '/dashboard/pages/' . $page->id;
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
        $env = App::environment();

        return Inertia::render('Plans/Plans')->with([ 'path' => $path["url"], 'env' => $env ]);
    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return JsonResponse
     * @throws Throwable
     */
    public function cancel(Request $request, SubscriptionService $subscriptionService): JsonResponse {

        $gatewayData = $subscriptionService->cancelAtGateway($request);

        if($gatewayData["success"]) {
            $data = $subscriptionService->cancelSubscriptionDB($gatewayData, $request);
            $returnResponse = [
                'success' => $data["success"],
                'message' => $data["message"],
                'ends_at' => array_key_exists('ends_at', $data) ? $data["ends_at"] : null,
            ];
        } else {
            $returnResponse = [
                'success' => false,
            ];
        }

        return response()->json($returnResponse);
    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return JsonResponse
     * @throws Throwable
     */
    public function resume(Request $request, SubscriptionService $subscriptionService): JsonResponse {

        $data = $subscriptionService->resumeAtGateway($request);

        $data = $subscriptionService->resumeSubscriptionDB($data);

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

    public function getPayPalClient() {
        $payPalClient = App::environment(['local', 'staging']) ? config('paypal.sandbox.client_id') : config('paypal.live.client_id');
        return response()->json([
            'payPalClient' => $payPalClient,
        ]);
    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return JsonResponse
     */
    public function payPalSubscribeSuccess(Request $request, SubscriptionService $subscriptionService): JsonResponse {

        $subscriptionService->newPayPalSubscription($request);

        return response()->json([
            'success' => true,
        ]);

    }
}
