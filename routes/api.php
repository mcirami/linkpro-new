<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ShopifyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/



//Public Routes
Route::post('login', [AuthController::class,'login']);
Route::post('register', [AuthController::class,'register']);
Route::get('connect-shopify-store', [ShopifyController::class, 'showConnect'])->middleware('auth')->name('api.show.connect');
Route::get('auth/shopify', [ShopifyController::class, 'auth']);
Route::get('auth/shopify/callback', [ShopifyController::class, 'apiCallback']);
// Protected Routes

Route::middleware('auth:sanctum')->group(function() {
    Route::post('logout', [AuthController::class,'logout']);
    Route::resource('shopify', ShopifyController::class);
    Route::get('auth/shopify/disconnect', [ShopifyController::class, 'disconnect']);
});
