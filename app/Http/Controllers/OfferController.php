<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Offer;
use App\Services\OfferService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OfferController extends Controller
{

    public function updateOfferIcon(Offer $offer, Request $request, OfferService $offerService) {
        $userID = Auth::id();

        if ($offer->user_id != $userID) {
            return abort(404);
        }

        $imagePath = $offerService->updateOfferIcon($request, $userID, $offer);

        return response()->json(['message' => 'Course Icon Updated', 'imagePath' => $imagePath]);

    }

    public function updateOfferData(Offer $offer, Request $request, OfferService $offerService) {

        $userID = Auth::id();

        if ($offer->user_id != $userID) {
            return abort(404);
        }

        $message = $offerService->updateOfferData($offer, $request);

        return response()->json(['message' => $message]);

    }

    public function publishOffer(Offer $offer,  OfferService $offerService) {
        $userID = Auth::id();

        if ($offer->user_id != $userID) {
            return abort(404);
        }

        $success = $offerService->publishOffer($offer);

        if ($success) {
            $returnData = array(
                'success' => true,
                'message' => 'Offer Published'
            );

            return response()->json($returnData);
        } else {
            $returnData = array(
                'success' => false,
                'message' => 'Course must have an Icon and price set before being published',
                'code' => 400
            );
            return response()->json($returnData, 400);
        }

    }
}
