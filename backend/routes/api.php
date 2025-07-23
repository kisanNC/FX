<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\VideoController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AlbumController;

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


//service routes
use App\Http\Controllers\BookingServiceController;

Route::get('/services', [BookingServiceController::class, 'index']);
Route::post('/services', [BookingServiceController::class, 'store']);
Route::put('/services/{bookingService}', [BookingServiceController::class, 'update']);
Route::delete('/services/{bookingService}', [BookingServiceController::class, 'destroy']);

//new Advertise

Route::post('/albums', [AlbumController::class, 'store']);
Route::get('/albums', [AlbumController::class, 'index']);
Route::get('/albums/{id}', [AlbumController::class, 'show']);//show single album

