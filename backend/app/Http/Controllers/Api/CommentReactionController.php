<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\CommentReaction;

class CommentReactionController extends Controller
{
    public function show(Request $request, Comment $comment)
    {
      $userId = $request->user()?->id;

      $myReaction = $userId
        ? CommentReaction::where('comment_id', $comment->id)
          ->where('user_id', $userId)
          ->value('type')
          : null;

      return response()->json([
        'like_count' => $comment->reactions()->where('type', 'like')->count(),
        'dislike_count' => $comment->reactions()->where('type', 'dislike')->count(),
        'my_reaction' => $myReaction,
      ]);
    }

    public function toggle(Request $request, Comment $comment)
    {
    $validated = $request->validate([
        'type' => ['required', 'in:like,dislike'],
    ]);

    $userId = $request->user()?->id ?? 1;
    $type = $validated['type'];

    $reaction = CommentReaction::where('comment_id', $comment->id)
        ->where('user_id', $userId)
        ->first();

    if ($reaction && $reaction->type === $type) {
        $reaction->delete();

        return response()->json([
            'type' => null,
            'like_count' => $comment->reactions()->where('type', 'like')->count(),
            'dislike_count' => $comment->reactions()->where('type', 'dislike')->count(),
        ]);
    }

    CommentReaction::updateOrCreate(
        [
            'comment_id' => $comment->id,
            'user_id' => $userId,
        ],
        [
            'type' => $type,
        ]
    );

    return response()->json([
        'type' => $type,
        'like_count' => $comment->reactions()->where('type', 'like')->count(),
        'dislike_count' => $comment->reactions()->where('type', 'dislike')->count(),
    ]);
  }
}
