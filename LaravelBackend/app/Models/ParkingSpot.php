<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParkingSpot extends Model
{
    //

    use HasFactory;
    protected $fillable = ['name', 'location', 'price', 'spots', 'latitude', 'longitude', 'phone_no'];
    protected $appends = ['position'];

    public function getPositionAttribute()
    {
        return [
            'latitude' => $this->latitude,
            'longitude' => $this->longitude
        ];
    }
}
