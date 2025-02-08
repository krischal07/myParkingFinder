<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ParkingSpot;

class ParkingSpotController extends Controller
{
    //
    public function store(Request $request)
    {
        // $request->validate([
        //     'name' => 'required|string',
        //     'location' => 'required|string',
        //     'price' => 'required|numeric',
        //     'spots' => 'required|numeric',
        //     'latitude' => 'required|numeric',
        //     'longitude' => 'required|numeric',
        //     'phone_no' => 'required|numeric',
        //     'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        //     // 'description' => 'required|string',
        // ]);
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('spots', 'public'); // Saves in storage/app/public/spots
        }

        $item = ParkingSpot::create([
            'name' => $request->input('name'),
            'location' => $request->input('location'),
            'price' => $request->input('price'),
            'spots' => $request->input('spots'),
            'latitude' => $request->input('latitude'),
            'longitude' => $request->input('longitude'),
            'phone_no' => $request->input('phone_no'),
            'image' => $imagePath,
        ]);


        // $parkingSpot = ParkingSpot::create($request->all());
        return response()->json(['message' => 'Parking spot added!', 'data' => $item], 201);
    }

    public function index()
    {
        $parkingSpots = ParkingSpot::all()->map(function ($spot) {
            return [
                'id' => $spot->id,
                'name' => $spot->name,
                'location' => $spot->location,
                'price' => $spot->price,
                'spots' => $spot->spots,
                'position' => [$spot->latitude, $spot->longitude],
                'phone-no' => $spot->phone_no,
                'image' =>  url('storage/' . $spot->image)
            ];
        });

        return response()->json($parkingSpots);
        // return response()->json(ParkingSpot::all());
    }

    public function destroy($id)
    {
        $parkingSpot_delete = ParkingSpot::find($id);
        // echo $parkingSpot_delete;
        if (!$parkingSpot_delete) {
            return response()->json(['message' => 'Parking spot not found', 404]);
        }

        $parkingSpot_delete->delete();
        return response()->json(['message' => 'Parking spot deleted successfully',]);
    }


    public function show_data($id)
    {
        $parkingSpot = ParkingSpot::find($id);
        // echo $parkingSpot_delete;
        if (!$parkingSpot) {
            return response()->json(['message' => 'Parking spot not found', 404]);
        }

        return response()->json($parkingSpot);
    }
}
