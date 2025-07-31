<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    // GET /api/videos
    public function index()
    {
        return Video::all();
    }

    // POST /api/videos
    public function store(Request $request)
    {
        $request->validate([
            'video_url' => 'required|url',
            'description' => 'nullable|string',
        ]);

        $video = Video::create($request->only('video_url', 'description'));

        return response()->json($video, 201);
    }

    // GET /api/videos/{id}
    public function show($id)
    {
        $video = Video::find($id);

        if (!$video) {
            return response()->json(['message' => 'Video not found'], 404);
        }

        return response()->json($video);
    }

    // PUT /api/videos/{id}
    public function update(Request $request, $id)
    {
        $video = Video::find($id);

        if (!$video) {
            return response()->json(['message' => 'Video not found'], 404);
        }

        $request->validate([
            'video_url' => 'sometimes|required|url',
            'description' => 'nullable|string',
        ]);

        $video->update($request->only('video_url', 'description'));

        return response()->json($video);
    }

    // DELETE /api/videos/{id}
    public function destroy($id)
    {
        $video = Video::find($id);

        if (!$video) {
            return response()->json(['message' => 'Video not found'], 404);
        }

        $video->delete();

        return response()->json(['message' => 'Video deleted successfully']);
    }
}
