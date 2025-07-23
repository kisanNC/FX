<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NewAdvertise;
use App\Models\AlbumImage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AlbumController extends Controller
{
    public function store(Request $request)
{
    try {
        $request->validate([
            'name' => 'required|string|max:255',
            'images' => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $images = $request->file('images');

        if (!$images || count($images) === 0) {
            return response()->json(['error' => 'No images uploaded'], 400);
        }

        $previewPath = $images[0]->store('album_images', 'public');

        $album = NewAdvertise::create([
            'name' => $request->name,
            'preview_image' => $previewPath,
        ]);

        foreach ($images as $image) {
            $path = $image->store('album_images', 'public');
            AlbumImage::create([
                'album_id' => $album->id,
                'image_path' => $path,
            ]);
        }

        return response()->json(['message' => 'Album created successfully']);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Something went wrong',
            'message' => $e->getMessage()
        ], 500);
    }
}

    public function uploadToAlbum(Request $request, $id)
    {
        $request->validate([
            'images' => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $album = NewAdvertise::findOrFail($id);
        $images = $request->file('images');

        foreach ($images as $image) {
            $path = $image->store('album_images', 'public');
            AlbumImage::create([
                'album_id' => $album->id,
                'image_path' => $path,
            ]);
        }

        return response()->json(['message' => 'Images uploaded to album']);
    }

    public function index()
    {
        return NewAdvertise::with('images')->get();
    }

    public function show($id)
    {
        return NewAdvertise::with('images')->findOrFail($id);
    }




    public function destroy($id)
{
    try {
        $album = NewAdvertise::findOrFail($id);

        // Delete all images from storage and DB
        foreach ($album->images as $image) {
            Storage::disk('public')->delete($image->image_path);
            $image->delete();
        }

        // Delete the preview image file
        Storage::disk('public')->delete($album->preview_image);

        // Delete the album itself
        $album->delete();

        return response()->json(['message' => 'Album deleted successfully']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to delete album', 'message' => $e->getMessage()], 500);
    }
}

public function destroyImage($imageId)
{
    try {
        $image = AlbumImage::findOrFail($imageId);

        // Delete image file from storage
        Storage::disk('public')->delete($image->image_path);

        $image->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to delete image', 'message' => $e->getMessage()], 500);
    }
}



public function update(Request $request, $id)
{
    try {
        $album = NewAdvertise::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'preview_image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'images' => 'sometimes|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Update name if given
        if ($request->has('name')) {
            $album->name = $request->name;
        }

        // Update preview image if given
        if ($request->hasFile('preview_image')) {
            // Delete old preview image file
            Storage::disk('public')->delete($album->preview_image);

            $previewPath = $request->file('preview_image')->store('album_images', 'public');
            $album->preview_image = $previewPath;
        }

        $album->save();

        // Add new images to album if any
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('album_images', 'public');
                AlbumImage::create([
                    'album_id' => $album->id,
                    'image_path' => $path,
                ]);
            }
        }

        return response()->json(['message' => 'Album updated successfully']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to update album', 'message' => $e->getMessage()], 500);
    }
}

public function updateImage(Request $request, $imageId)
{   Log::info('Files:', $request->allFiles());
  Log::info('Has file: ' . ($request->hasFile('image') ? 'true' : 'false'));

    try {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imageModel = AlbumImage::findOrFail($imageId);

        // Delete old image file
        Storage::disk('public')->delete($imageModel->image_path);

        // Store new image
        $newPath = $request->file('image')->store('album_images', 'public');

        // Update record
        $imageModel->image_path = $newPath;
        $imageModel->save();

        return response()->json(['message' => 'Image updated successfully']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to update image', 'message' => $e->getMessage()], 500);
    }
}

}


