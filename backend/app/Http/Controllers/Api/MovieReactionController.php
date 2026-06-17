<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use App\Models\MovieReaction;
use Illuminate\Http\Request;

class MovieReactionController extends Controller
{
    public function show(Movie $movie)
    {
      $userId = 1; // （仮）

      $myReaction = MovieReaction::where('movie_id', $movie->id)
        ->where('user_id', $userId)
        ->value('type');

      return response()->json([
        'like_count' => $movie->reactions()->where('type', 'like')->count(),
        'dislike_count' => $movie->reactions()->where('type', 'dislike')->count(),
        'my_reaction' => $myReaction,
      ]);
    }

    public function toggle(Request $request, Movie $movie)
    {
      $validated = $request->validate([
        'type' => ['required', 'in:like,dislike'],
      ]);

      $userId = 1; //（仮）

      $reaction = MovieReaction::where('movie_id', $movie->id)
      ->where('user_id', $userId)
      ->first();

      if ($reaction && $reaction->type === $validated['type']) {
        $reaction->delete();
        $myReaction = null;
      } elseif ($reaction) {
        $reaction->update([
          'type' => $validated['type'],
        ]);
        $myReaction = $validated['type'];
      } else {
        MovieReaction::create([
          'movie_id' => $movie->id,
          'user_id' => $userId,
          'type' => $validated['type'],
        ]);
        $myReaction = $validated['type'];
      }
      return response()->json([
        'like_count' => $movie->reactions()->where('type', 'like')->count(),
        'dislike_count' => $movie->reactions()->where('type', 'dislike')->count(),
        'my_reaction' => $myReaction,
      ]);
    }
}
