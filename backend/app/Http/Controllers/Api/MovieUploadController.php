<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MovieUploadController extends Controller
{
    public function store(Request $request)
    {
      $validated = $request->validate([
        'title' => ['required', 'string', 'max:255'],
        'description' => ['nullable', 'string'],
        'movie' => ['required', 'file', 'mimes:mp4,mov,avi,web', 'max:102400'],
        'thumbnail' => ['nullable', 'image', 'max:5120'],
      ]);

      $moviePath = $request->file('movie')->store('movies', 'public');

      if ($request->hasFile('thumbnail')) {
        $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
      } else {
        $thumbnailPath = $this->generateThumbnail($moviePath);
      }

      $movie = Movie::create([
        'user_id' => $request->user()->id,
        'title' => $validated['title'],
        'description' => $validated['description'] ?? null,
        'movie_path' => '/storage/' .$moviePath,
        'thumbnail_path' => $thumbnailPath ? '/storage/' . $thumbnailPath : null,
      ]);

      return response()->json($movie, 201);
    }

    private function generateThumbnail(string $moviePath): string
    {
      $disk = Storage::disk('public');
      $thumbnailPath = 'thumbnails/' . Str::uuid() . '.jpg';

      $disk->makeDirectory('thumbnails');

      $result = Process::timeout(15)->run([
        'ffmpeg',
        '-y',
        '-ss',
        '00:00:01',
        '-i',
        $disk->path($moviePath),
        '-frames:v',
        '1',
        '-q:v',
        '2',
        $disk->path($thumbnailPath),
      ]);

      if ($result->failed()) {
        abort(422, 'Failed to generate thumbnail.');
      }

      return $thumbnailPath;
    }
}
