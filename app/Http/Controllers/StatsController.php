<?php

namespace App\Http\Controllers;

use App\Services\StatsServices;
use Illuminate\Http\Request;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class StatsController extends Controller
{
    /**
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function show() {

        Javascript::put([]);
        return view('stats.show');
    }

    /**
     * @param Request $request
     * @param StatsServices $statsServices
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPageStats(Request $request, StatsServices $statsServices) {

        $data = $statsServices->getAllPageStats($request);

        return response()->json(['data' => $data]);
    }

    /**
     * @param Request $request
     * @param StatsServices $statsServices
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLinkStats(Request $request, StatsServices $statsServices) {

        $data = $statsServices->getAllLinkStats($request);

        return response()->json(['data' => $data]);
    }

    /**
     * Get deleted link stats for today
     *
     * @param StatsServices $statsServices
     *
     * @return \Illuminate\Http\JsonResponse
     */
    /*public function getDeletedStats(StatsServices $statsServices) {

        $data = $statsServices->getTodaysDeletedStats();

        return response()->json([
            'deletedStats' => $data,
        ]);
    }*/

    public function getFolderStats(Request $request, StatsServices $statsServices) {

        $data = $statsServices->getAllFolderStats($request);

        return response()->json(['data' => $data]);
    }

    public function getOfferStats(Request $request, StatsServices $statsServices) {

        $data = $statsServices->getAllOfferStats($request);

        return response()->json(['data' => $data]);
    }

    public function getPublisherStats(Request $request, StatsServices $statsServices) {

        $data = $statsServices->getAllPublisherStats($request);

        return response()->json(['data' => $data]);
    }
}
