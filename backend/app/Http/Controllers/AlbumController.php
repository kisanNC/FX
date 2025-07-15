<?php
use App\Models\Album;
use App\Models\AlbumImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;

class AlbumController extends Controller
{
    public function index()
    {
        return Album::with('images')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $album = Album::create([
            'name' => $request->name,
        ]);

        $preview = null;

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $key => $image) {
                $path = $image->store('albums', 'public');
                AlbumImage::create([
                    'album_id' => $album->id,
                    'image_path' => $path,
                ]);
                if ($key === 0) {
                    $preview = $path;
                }
            }
        }

        $album->update(['preview_image' => $preview]);

        return response()->json(['album' => $album->load('images')]);
    }

    public function show($id)
    {
        return Album::with('images')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $album = Album::findOrFail($id);
        $album->update(['name' => $request->name]);

        return response()->json(['album' => $album]);
    }

    public function destroy($id)
    {
        $album = Album::findOrFail($id);
        $album->delete();

        return response()->json(['message' => 'Album deleted']);
    }

    public function uploadImage(Request $request, $id)
    {
        $request->validate([
            'images.*' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $album = Album::findOrFail($id);
        $paths = [];

        foreach ($request->file('images') as $image) {
            $path = $image->store('albums', 'public');
            AlbumImage::create([
                'album_id' => $album->id,
                'image_path' => $path,
            ]);
            $paths[] = $path;
        }

        return response()->json(['uploaded' => $paths]);
    }
}

