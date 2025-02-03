<?php

use App\Http\Controllers\ParkingSpotController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/users', function () {
    $users = User::get();
    return response()->json($users);
});

Route::post('/parking_spots', [ParkingSpotController::class, 'store']);
Route::get('/parking_spots', [ParkingSpotController::class, 'index']);
