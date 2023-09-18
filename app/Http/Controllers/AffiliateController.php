<?php

namespace App\Http\Controllers;

use App\Models\Affiliate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class AffiliateController extends Controller
{
    public function show() {

        Javascript::put([
            'user_info' => Auth::user(),
        ]);

        return view('affiliate.show');
    }

    public function store() {

        $user = Auth::user();

        $user->Affiliates()->updateOrCreate(
            ['user_id' => $user->id],
            ['status' => "approved"]
        );

        return redirect()->back()->with(['success' => true]);
    }
}
