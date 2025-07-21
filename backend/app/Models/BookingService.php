<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BookingService extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'price', 'type', 'date', 'time'];

    public function images()
    {
        return $this->hasMany(BookingImage::class);
    }
}

