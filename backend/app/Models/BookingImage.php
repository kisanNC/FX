<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BookingImage extends Model
{
    use HasFactory;

    protected $fillable = ['booking_service_id', 'image_path'];

    public function bookingService()
    {
        return $this->belongsTo(BookingService::class);
    }
}

