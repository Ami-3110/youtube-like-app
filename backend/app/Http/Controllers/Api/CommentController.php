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
        'parent_id' => ['nullable', 'exists:comments,id'],
      ]);

      $comment = Comment::create([
        'movie_id' => $movie->id,
        'user_id' => $request->user()->id,
        'parent_id' => $validated['parent_id'] ?? null,
        'body' => $validated['body'],
      ]);

      $comment->load('user');

      return response()->json($comment, 201);
    }

    public function update(Request $request, Comment $comment)
    {
      if ($comment->user_id !== $request->user()->id) {
        return response()->json([
          'message' => '権限がありません',
        ], 403);
      }

      $validated = $request->validate([
        'body' => ['required', 'string', 'max:1000'],
      ]);
      $comment->update([
        'body' => $validated['body'],
      ]);

      return response()->json(
        $comment->load('user')
      );
    }

    public function destroy(Request $request, Comment $comment)
    {
      if ($comment->user_id !== $request->user()->id) {
        return response()->json([
          'message' => '権限がありません',
        ], 403);
      }
      $comment->delete();

      return response()->json([
        'message' => 'Comment deleted',
      ]);
    }
}
