<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Movie;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Movie $movie)
    {
      $comments = $movie->comments()
      ->with('user')
      ->whereNull('parent_id')
      ->latest()
      ->get();

      return response()->json($comments);
    }

    public function store(Request $request, Movie $movie)
    {
      $validated = $request->validate([
        'body' => ['required', 'string', 'max:1000'],
      ]);
      $comment = Comment::create([
        'movie_id' => $movie->id,
        'user_id' => 1, // （仮）認証入れたらauth()->id()に
        'body' => $validated['body'],
      ]);

      $comment->load('user');

      return response()->json($comment, 201);
    }
}
