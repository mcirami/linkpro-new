<?php

namespace App\Http\Controllers;

use App\Services\SubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Traits\SubscriptionTrait;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    use SubscriptionTrait;

    /**
     * @param SubscriptionService $subscriptionService
     *
     * @return \Inertia\Response
     */
    public function purchase(SubscriptionService $subscriptionService): \Inertia\Response {

        $data = $subscriptionService->showPurchasePage();

        return Inertia::render('Subscription/Purchase')->with([
            'plan' => $data['plan'],
            'token' => $data['token'],
            'price' => $data["price"],
            'existing' => $data["existing"],
            'bypass' => $data['bypass']
        ]);
    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return mixed
     */
    public function store(Request $request, SubscriptionService $subscriptionService): mixed {


        $data = $subscriptionService->newSubscription($request);

        $user = Auth::user();
        $page = $user->pages()->where('user_id', $user["id"])->where('default', true)->first();

        $newData = null;
        if(array_key_exists("bypass", $data) && $data["bypass"]) {
            $newData = $subscriptionService->createManualSubscription($request->discountCode);
        }

        $success = $newData ? $newData['success'] : $data['success'];
        $message = $newData ? $newData['message'] : $data['message'];
        //$url = '/dashboard/pages/' . $page->id;

        return response()->json(['success' => $success, 'message' => $message, 'url' => "/dashboard"]);
    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     * @return mixed
     */
    public function changePlan(Request $request, SubscriptionService $subscriptionService): mixed {

        $path = $request->session()->get('_previous');

        $data = $subscriptionService->updateSubscription($request);

        if( (str_contains($path["url"], '/subscribe') || str_contains($path["url"], '/plans') ) && $data["success"] == true ) {
            $user = Auth::user();
            $page = $user->pages()->where('user_id', $user["id"])->where('default', true)->first();
            $url = '/dashboard/pages/' . $page->id;
            return Inertia::location($url)->with(['message' => $data["message"]]);
        }

        return response()->json(['success' => $data["success"], 'message' => $data["message"]]);
    }

    /**
     * @param Request $request
     * @param SubscriptionService $subscriptionService
     *
     *
     */
    public function plans(Request $request, SubscriptionService $subscriptionService) {

        $path = $request->session()->get('_previous');

        /*$subscription = $subscriptionService->showPlansPage();*/

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
