<?php

namespace App\Http\Controllers;

use App\Events\PurchasedItem;
use App\Models\Course;
use App\Models\Offer;
use App\Models\User;
use App\Services\PurchaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Traits\SubscriptionTrait;
use Inertia\Inertia;
use Inertia\Response;


class PurchaseController extends Controller
{
    use SubscriptionTrait;

    /**
     * @param Request $request
     * @param User $user
     * @param Course $course
     * @param PurchaseService $purchaseService
     *
     * @return Response
     */
    public function show(Request $request, User $user, Course $course, PurchaseService $purchaseService): Response {

        //Session::put('creator', $user->username);
        $token = $purchaseService->getToken();
        $offer = $course->Offer()->first();
        $affRef = $request->get('a') ? $request->get('a') : "none";
        $clickId = $request->get('cid') ? $request->get('cid') : "internal";

        return Inertia::render('Checkout/Checkout')->with([
            'token'             => $token,
            'offer'             => $offer,
            'course'            => $course,
            'creator'           => $user->username,
            'affRef'            => $affRef,
            'clickId'           => $clickId
        ]);
    }

    /**
     * @param Request $request
     * @param PurchaseService $purchaseService
     *
     * @return JsonResponse
     */
    public function store(Request $request, PurchaseService $purchaseService): JsonResponse {

        $offer = Offer::findOrFail($request->offer);

        $data = $purchaseService->purchase($offer, $request);
        $url = null;

        if ($data["success"]) {

            PurchasedItem::dispatch($data["purchase"]);

            $username = $offer->user()->pluck('username')->first();
            $url = config('app.url') . $username . "/course/" . $data["course_slug"];
        }

        return response()->json(['success' => $data["success"], 'message' => $data["message"], 'url' => $url]);

    }
}
