<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use App\Services\UserService;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Traits\UserTrait;

class UserController extends Controller
{
    use UserTrait;

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
     * @return \Inertia\Response
     */
    public function edit(UserService $userService): \Inertia\Response {

        $data = $userService->getUserInfo();

        return Inertia::render('User/User')->with([
            'user'                  => $data['user'],
            'subscriptionInfo'      => $data["subscription"],
            'payment_method'        => $data["payment_method"],
            'token'                 => $data['token'],
            'payment_method_token'  => $data['payment_method_token']
        ]);
    }

    /**
     * @param UpdateUserRequest $request
     * @param UserService $userService
     * @param User $user
     *
     *
     */
    public function updateAccountInfo(UpdateUserRequest $request, UserService $userService) {

        $userService->updateUserInfo($request);
    }


    /**
     * @param Request $request
     * @param UserService $userService
     *
     *
     */
    public function updateCard(Request $request, UserService $userService) {

        $data = $userService->updateCard($request);

        //return response()->json(['success' => true, 'message' => "Credit Card Updated", 'pmLastFour' => $pmLastFour]);
        //return redirect()->back()->with(['success' => 'Credit Card Updated']);
        //return Inertia::render('User/User', ['success' => true, 'message' => "Credit Card Updated", 'pmLastFour' => $pmLastFour]);
        return response()->json(['success' => $data['success'], 'message' => $data["message"]]);
    }

    /**
     * @param Request $request
     * @param UserService $userService
     *
     *
     */
    public function updateMethod(Request $request, UserService $userService) {

        $data = $userService->updatePaymentMethod($request);

        return response()->json(['success' => $data['success'], 'message' => $data["message"]]);
        //return redirect()->back()->with(['success' => 'Payment Method Updated']);
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
                'siteURL'       => URL::to('/') . "/",
                'message'       => $data["message"],
                'userID'        => $user['id'],
                'subscribed'    => $data['subscribed']
                ]
        );
    }

    public function getAllUserPages() {
        $user = Auth::user();

        $pages = $this->getUserPages($user);

        return response()->json(['success' => true, 'pages' => $pages]);
    }
}
