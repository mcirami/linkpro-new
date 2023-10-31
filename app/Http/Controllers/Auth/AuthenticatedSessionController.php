<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(Course $course = null): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ])->with(['course' => $course]);
    }


    /**
     * @param LoginRequest $request
     *
     * @return mixed
     * @throws ValidationException
     */
    public function store(LoginRequest $request): mixed {
        $request->authenticate();

        $request->session()->regenerate();

        return auth()->user()->getRedirectRoute();
    }

    public function customLoginPost(LoginRequest $request) {

        $credentials = $request->except(['_token']);
        $login = request()->input('identity');
        $field = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        request()->merge([$field => $login]);
        unset($credentials["identity"]);
        $credentials[$field] = $login;

        $request->authenticate();

        $request->session()->regenerate();
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        $courseSlug = isset($_GET['course']) && $_GET['course'] !== "" ? $_GET['course'] : null;

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        $path = $courseSlug ? "/". $courseSlug . "/login" : "/login";

        return response()->json(['path' => $path]);
    }
}
