<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlbumImage extends Model
{
    use HasFactory;

    protected $fillable = ['album_id', 'image_path'];

    public function album()
    {
        return $this->belongsTo(NewAdvertise::class, 'album_id');
    }
}

