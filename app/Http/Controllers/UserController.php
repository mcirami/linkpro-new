<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use App\Services\UserService;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use App\Http\Traits\UserTrait;
use Inertia\Response;
use App\Http\Traits\BillingTrait;

class UserController extends Controller
{
    use UserTrait, BillingTrait;

    /**
     * @param User $user
     *
     * @return Application|Factory|View
     */
    public function show(User $user): View|Factory|Application {
        $user->load('links');

        return view('users.show', [
            'user' => $user
        ]);
    }

    /**
     *
     * @return Response
     */
    public function edit(): Response {
        return Inertia::render('User/User');
    }

    /**
     * @param UpdateUserRequest $request
     * @param UserService $userService
     */
    public function updateAccountInfo(UpdateUserRequest $request, UserService $userService): void {

        $userService->updateUserInfo($request);
    }

    /**
     * @param User $user
     * @param UserService $userService
     *
     * @return Application|Factory|View
     */
    public function emailSubscription(User $user, UserService $userService): View|Factory|Application {

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

    /**
     * @return JsonResponse
     */
    public function getAllUserPages(): \Illuminate\Http\JsonResponse {
        $user = Auth::user();

        $pages = $this->getUserPages($user);

        return response()->json(['success' => true, 'pages' => $pages]);
    }
}
