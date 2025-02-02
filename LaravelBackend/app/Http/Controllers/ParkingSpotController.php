<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ParkingSpot;

class ParkingSpotController extends Controller
{
    //
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'location' => 'required|string',
            'price' => 'required|numeric',
            'spots' => 'required|numeric',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            // 'description' => 'required|string',
        ]);

        $parkingSpot = ParkingSpot::create($request->all());
        // return response()->json(['message'=>'Parking spot added!','data' =>$parkingSpot],201);
        return response()->json(['message' => 'Parking spot added!', 'data' => $parkingSpot], 201);
    }

    public function index()
    {
        $parkingSpots = ParkingSpot::all()->map(function ($spot) {
            return [
                'id' => $spot->id,
                'name' => $spot->name,
                'location' => $spot->location,
                'price' => $spot->price,

                'position' => [$spot->latitude, $spot->longitude],
            ];
        });

        return response()->json($parkingSpots);
    }
}
