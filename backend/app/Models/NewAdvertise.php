<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewAdvertise extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'preview_image'];

    public function images()
    {
        return $this->hasMany(AlbumImage::class, 'album_id');
    }
}

