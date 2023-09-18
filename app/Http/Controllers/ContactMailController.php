<?php

namespace App\Http\Controllers;

use App\Mail\ContactMail;
use Illuminate\Http\Request;
use App\Http\Requests\ContactRequest;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class ContactMailController extends Controller
{
    public function index() {

        Javascript::put([]);
        return view('contact.show');
    }

    public function contactSendMail(ContactRequest $request) {

        $reason = $request->reason;

        if ($reason == "general" || $reason == "support") {
            $email = 'support@link.pro';
        } else {
            $email = 'partners@link.pro';
        }

        Mail::to($email)->send(new ContactMail($request));

        return back();
    }
}
