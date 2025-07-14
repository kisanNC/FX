<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VideoController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BookingController;

use App\Http\Controllers\WebhookController;

Route::post('/web3form/webhook', [WebhookController::class, 'handle']);


// ✅ Public route for user registration
Route::post('/register', [UserController::class, 'store']);

// ✅ Protected routes (require Sanctum token)
Route::middleware('auth:sanctum')->group(function () {

    // 🔐 Get authenticated user info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // 📅 Booking routes
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);
    Route::put('/bookings/{id}', [BookingController::class, 'update']);



    // 🎥 Video CRUD routes
    Route::apiResource('videos', VideoController::class);
});
