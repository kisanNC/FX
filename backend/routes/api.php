<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\VideoController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\ContactController;

// ✅ Webhook route (if used)
Route::post('/webhook', [WebhookController::class, 'handle']);

// ✅ Contact form route
Route::apiResource('contacts', ContactController::class);
Route::put('/contacts/{id}/status', [ContactController::class, 'updateStatus']);

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
    Route::put('/bookings/{id}', [BookingController::class, 'update']);
    Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);

    // 🎥 Video CRUD routes
    Route::apiResource('videos', VideoController::class);
});
