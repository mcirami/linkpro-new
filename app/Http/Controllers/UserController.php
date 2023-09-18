<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use App\Services\UserService;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class UserController extends Controller
{

    /**
     * @param User $user
     *
     * @return Application|Factory|View
     */
    public function show(User $user) {
        $user->load('links');

        return view('users.show', [
            'user' => $user
        ]);
    }

    /**
     * @param UserService $userService
     *
     * @return Application|Factory|View
     */
    public function edit(UserService $userService) {

        $landingPageData = null;

        $data = $userService->getUserInfo();

        Javascript::put([
            'user_info' => Auth::user(),
            'landingPageData' => $landingPageData
        ]);

        return view('users.edit', [
            'user'                  => $data['user'],
            'subscription'          => $data["subscription"],
            'payment_method'        => $data["payment_method"],
            'token'                 => $data['token'],
            'payment_method_token'  => $data['payment_method_token'],
            'landingPageData'       => $landingPageData,
        ]);
    }

    /**
     * @param UpdateUserRequest $request
     * @param UserService $userService
     * @param User $user
     *
     * @return RedirectResponse
     */
    public function updateAccountInfo(UpdateUserRequest $request, UserService $userService, User $user) {

        $userService->updateUserInfo($request, $user);

        return redirect()->back()->with(['success' => 'Changes saved successfully']);
    }

    /**
     * @param Request $request
     * @param UserService $userService
     *
     * @return RedirectResponse
     */
    public function updateCard(Request $request, UserService $userService) {

        $userService->updateCard($request);

        return redirect()->back()->with(['success' => 'Credit Card Updated']);

    }

    /**
     * @param Request $request
     * @param UserService $userService
     *
     * @return RedirectResponse
     */
    public function updateMethod(Request $request, UserService $userService) {

        $userService->updatePaymentMethod($request);

        return redirect()->back()->with(['success' => 'Payment Method Updated']);
    }

    /**
     * @param User $user
     * @param UserService $userService
     *
     * @return Application|Factory|View
     */
    public function emailSubscription(User $user, UserService $userService) {

        $data = $userService->handleEmailSubscription($user);

        return view(
            'users.emailSubscription', [
                'siteURL'       => \URL::to('/') . "/",
                'message'       => $data["message"],
                'userID'        => $user['id'],
                'subscribed'    => $data['subscribed']
                ]
        );
    }

    public function logout(Request $request) {
        Auth::logout();
        Session::forget('url.intended');
        Session::forget('permissions');
        $course = $request->get('course');
        if (isset($course)) {
            $path = "/". $course . "/login";
        } else {
            $path = "/login";
        }

        $request->session()->flush();

        return response()->json(['path' => $path, 'course' => $course]);
    }
}
