<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Course;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
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
     * @return RedirectResponse
     * @throws ValidationException
     */
    public function store(LoginRequest $request): RedirectResponse {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * @param Request $request
     * @param $user
     *
     * @return Application|\Illuminate\Foundation\Application|RedirectResponse|Redirector|int
     */
    protected function authenticated(Request $request, $user): \Illuminate\Foundation\Application|int|Redirector|RedirectResponse|Application {

        $loginURL = url()->previous();
        $roles = $user->getRoleNames();
        //$permissions = $user->getPermissionsViaRoles()->pluck('name');
        $courseID = isset($_GET['course']) ? $_GET['course'] : null;
        $course = null;
        if ($courseID) {
            $course = Course::findOrFail($courseID);
            $creator = User::where('id', '=', $course->user_id)->get()->pluck('username');
        }

        if ($roles->contains('admin')) {

            $previousURL = Session::get( 'url.intended' );

            if ( $previousURL ) {
                return Redirect::intended();
            } else {
                if ($course) {
                    return redirect('/' . $creator[0] . '/course/' . $course->slug);
                } else if (str_contains($loginURL, "admin")) {
                    return redirect( '/admin' );
                } else {
                    return redirect( '/dashboard' );
                }
            }

        } else if ($roles->contains("course.user") && $roles->contains('lp.user')) {

            $previousURL = Session::get( 'url.intended' );
            if ( $previousURL ) {
                return Redirect::intended();
            } else {
                return redirect( '/dashboard' );
            }

        } else if ($roles->contains('lp.user')) {

            $userPages = $user->pages()->get();

            if ( $userPages->isEmpty() ) {
                return redirect()->route( 'create.page' );
            } else {
                $previousURL = Session::get( 'url.intended' );
                if ( $previousURL ) {
                    return Redirect::intended();
                } else {
                    return redirect( '/dashboard' );
                }
            }

        } else if ($roles->contains("course.user")) {

            $previousURL = Session::get('url.intended');
            if ($previousURL) {
                return Redirect($previousURL);
            } else if ($course) {
                return redirect('/' . $creator[0] . '/course/' . $course->slug);
            } else {
                return redirect('/courses');
            }
        } else {
            $userPages = $user->pages()->get();

            if ( $userPages->isEmpty() ) {
                return redirect()->route( 'create.page' );
            }
        }

        return 0;
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
