<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserChannelController extends Controller
{
    public function show(User $user)
    {
      $user->load([
        'movies.topics:id,name',
      ]);
      return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'handle' => $user->handle,
        'bio' => $user->bio,
        'avatar_path' => $user->avatar_path,
        'followers_count' => $user->followers()->count(),

        'movies' => $user->movies
         ->sortByDesc('created_at')
         ->values()
         ->map(function ($movie){
          return [
            'id' => $movie->id,
            'title' => $movie->title,
            'thumbnail_path' => $movie->thumbnail_path,
            'views' => $movie->views,
            'created_at' => $movie->created_at,
            'topics' => $movie->topics->map(fn ($topic) =>[
              'id' => $topic->id,
              'name' => $topic->name,
            ])->values(),
          ];
         }),
      ]);
    }
}
