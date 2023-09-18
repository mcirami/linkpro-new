<?php

namespace App\Http\Controllers;

use App\Events\PurchasedItem;
use App\Models\Course;
use App\Models\Offer;
use App\Models\User;
use App\Services\PurchaseService;
use Illuminate\Http\Request;
use App\Http\Traits\SubscriptionTrait;
use Illuminate\Support\Facades\Session;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;


class PurchaseController extends Controller
{
    use SubscriptionTrait;

    public function show(Request $request, User $user, Course $course, PurchaseService $purchaseService) {

        //Session::put('creator', $user->username);
        $token = $purchaseService->getToken();
        $offer = $course->Offer()->first();
        $affRef = $request->get('a') ? $request->get('a') : null;
        $clickId = $request->get('cid') ? $request->get('cid') : null;

        Javascript::put([
            'course'        => $course,
        ]);

        return view('purchase.show')->with([
            'token'             => $token,
            'offer'             => $offer,
            'course'            => $course,
            'creator'           => $user->username,
            'affRef'            => $affRef,
            'clickId'           => $clickId
        ]);
    }

    public function store(Request $request, PurchaseService $purchaseService) {

        $offer = Offer::findOrFail($request->offer);

        $data = $purchaseService->purchase($offer, $request);

        if ($data["success"]) {

            PurchasedItem::dispatch($data["purchase"]);

            $username = $offer->user()->pluck('username')->first();
            $courseSlug = $data["course_slug"];

            return redirect('/' . $username . "/course/" . $courseSlug)->with( ['success' => $data["message"]] );
        } else {
            return back()->withErrors($data["message"]);
        }

    }
}
