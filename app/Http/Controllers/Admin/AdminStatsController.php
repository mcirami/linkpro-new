<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminStatsServices;
use Illuminate\Http\Request;

class AdminStatsController extends Controller
{
    public function show() {

        return view('stats.admin.affiliate-stats');
    }

    public function getPublisherStats(Request $request, AdminStatsServices $adminStatsServices) {

        $data = $adminStatsServices->getAllPublisherStats($request);

        return response()->json(['data' => $data]);
    }

    public function getOfferStats(Request $request, AdminStatsServices $adminStatsServices) {

        $data = $adminStatsServices->getAllOfferStats($request);

        return response()->json(['data' => $data]);
    }
}
