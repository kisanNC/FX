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
            'title' => 'required|string',
            'description' => 'nullable|string',
            'video_url' => 'required|url',
            'thumbnail_url' => 'required|url',
            'uploaded_at' => 'required|date',
            'uploaded_by' => 'required|exists:users,id',
        ]);

        $video = Video::create($request->all());

        return response()->json($video, 201);
    }

    // GET /api/videos/{id}
    public function show($id)
    {
        $video = Video::find($id);

        if (!$video) {
            return response()->json(['message' => 'Video not found'], 404);
        }

        return $video;
    }

    // PUT /api/videos/{id}
    public function update(Request $request, $id)
    {
        $video = Video::find($id);

        if (!$video) {
            return response()->json(['message' => 'Video not found'], 404);
        }

        $request->validate([
            'title' => 'sometimes|required|string',
            'description' => 'nullable|string',
            'video_url' => 'sometimes|required|url',
            'thumbnail_url' => 'sometimes|required|url',
            'uploaded_at' => 'sometimes|required|date',
            'uploaded_by' => 'sometimes|required|exists:users,id',
        ]);

        $video->update($request->all());

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
