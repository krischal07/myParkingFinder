<?php

use App\Http\Controllers\ParkingSpotController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Http;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/users', function () {
    $users = User::get();
    return response()->json($users);
});

Route::post('/parking_spots', [ParkingSpotController::class, 'store']);
Route::get('/parking_spots', [ParkingSpotController::class, 'index']);
Route::get('/parking_spots/{id}', [ParkingSpotController::class, 'show_data']);
Route::delete('/parking_spots/{id}', [ParkingSpotController::class, 'destroy']);
// Route::get('/parking_spots', [ParkingSpotController::class, 'show_data']);


Route::get('/osrm-route', function () {
    $osrmUrl = "https://router.project-osrm.org/route/v1/driving/85.3592666148511,27.728716317787253;85.34,27.72?overview=full";

    // Forward the request to OSRM
    // $response = Http::get($osrmUrl);
    $response = Http::withOptions([
        'verify' => false, // Disables SSL verification
    ])->get("https://router.project-osrm.org/route/v1/driving/85.3592666148511,27.728716317787253;85.34,27.72?overview=full");


    return response($response->body(), $response->status())
        ->header("Access-Control-Allow-Origin", "*")
        ->header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        ->header("Access-Control-Allow-Headers", "Content-Type");
});
