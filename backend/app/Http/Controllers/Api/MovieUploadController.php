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
        'movie' => ['required', 'file', 'mimes:mp4,mov,avi,webm', 'max:102400'],
        'thumbnail' => ['nullable', 'image', 'max:5120'],
        'topic_ids' => ['nullable', 'array'],
        'topic_ids.*' => ['integer', 'exists:topics,id']
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

      $movie->topics()->sync($validated['topic_ids'] ?? []);

      return response()->json($movie, 201);
    }

    public function update(Request $request, Movie $movie)
    {
       if ($movie->user_id !== $request->user()->id) {
        abort(403);
       }

       $validated = $request->validate([
        'title' => ['required', 'string', 'max:255'],
        'description' => ['nullable', 'string'],
        'movie' => ['nullable', 'file', 'mimes:mp4,mov,avi,webm', 'max:102400'],
        'thumbnail' => ['nullable', 'image', 'max:5120'],
        'topic_ids' => ['nullable', 'array'],
        'topic_ids.*' => ['integer', 'exists:topics,id']
       ]);

       if ($request->hasFile('movie')){
        if($movie->movie_path) {
          Storage::disk('public')->delete(str_replace('/storage/', '', $movie->movie_path));
        }

        $moviePath = $request->file('movie')->store('movies', 'public');
        $movie->movie_path = '/storage/' . $moviePath;

        if(!$request->hasFile('thumbnail')){
          $thumbnailPath = $this->generateThumbnail($moviePath);
          $movie->thumbnail_path = $thumbnailPath ? '/storage/' . $thumbnailPath : null;
          }
       }

       if ($request->hasFile('thumbnail')){
        if($movie->thumbnail_path){
          Storage::disk('public')->delete(str_replace('/storage/', '', $movie->thumbnail_path));
        }

        $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
        $movie->thumbnail_path = '/storage/' . $thumbnailPath;
       }

       $movie->title= $validated['title'];
       $movie->description = $validated['description'] ?? null;
       $movie->save();

       $movie->topics()->sync($validated['topic_ids'] ?? []);

       return response()->json($movie->load('topics'));
    }

    public function destroy(Request $request, Movie $movie)
    {
      $user = $request->user();

      if ($movie->user_id !== $user->id && !$user->is_admin) {
        abort(403);
      }

      if ($movie->movie_path) {
        Storage::disk('public')->delete(str_replace('/storage/', '', $movie->movie_path));
      }

      if ($movie->thumbnail_path) {
        Storage::disk('public')->delete(str_replace('/storage/', '', $movie->thumbnail_path));
      }

      $movie->topics()->detach();

      $movie->delete();

      return response()->json([
        'message' => '動画を削除しました',
      ]);
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
