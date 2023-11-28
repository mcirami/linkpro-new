<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Referral;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cookie;
use App\Http\Traits\PageTrait;


class RegisteredUserController extends Controller
{

    use PageTrait;

    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $cookie = Cookie::get('lp_page_referral');

        $user = User::create([
            'username' =>  $request->email,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        if($cookie) {
            Referral::create([
                'user_id' => $cookie,
                'referral_id' => $user->id
            ]);
        }

        Auth::login($user);

        $pages = $this->getAllPages();

        return Inertia::render('Register/CreatePage', ['pageNames' => $pages]);
    }
}
