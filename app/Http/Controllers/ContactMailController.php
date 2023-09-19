<?php

namespace App\Http\Controllers;

use App\Mail\ContactMail;
use Illuminate\Http\Request;
use App\Http\Requests\ContactRequest;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class ContactMailController extends Controller
{
    public function index() {

        Javascript::put([]);
        return Inertia::render('Contact/Contact');
    }

    public function contactSendMail(ContactRequest $request) {

        $reason = $request->reason;

        if ($reason == "general" || $reason == "support") {
            $email = 'matteo@link.pro';//'support@link.pro';
        } else {
            $email = 'matteo@link.pro'; //'partners@link.pro';
        }

        Mail::to($email)->send(new ContactMail($request));

        return back();
    }
}
