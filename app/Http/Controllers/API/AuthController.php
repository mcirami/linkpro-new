<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends BaseController
{
    /**
     * Login api
     *
     * @return Response
     */
    public function login(LoginRequest $request): JsonResponse | Response
    {
        if(Auth::attempt(['email' => $request->email, 'password' => $request->password])){
            $user = Auth::user();
            $success['token'] =  $user->createToken('API token of ' . $user->username);
            $success['name'] =  $user->username;
            return $this->sendResponse($success, 'User login successfully.');
        }else{
            return $this->sendError('Unauthorised.', ['error'=>'Unauthorised']);
        }

        //$storeDomain = $request->get('storeDomain');

        /* return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ])->with(['course' => null, 'storeDomain' => null]); */


        return response()->json("login method", 200);
    }

    public function register(Request $request): JsonResponse {
        return response()->json("register method", 200);
    }

    public function logout(Request $request): JsonResponse {
        return response()->json("logout method", 200);
    }
}
