<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AlbumImage extends Model
{
    protected $fillable = ['album_id', 'image_path'];

    public function album()
    {
        return $this->belongsTo(Album::class);
    }
}

