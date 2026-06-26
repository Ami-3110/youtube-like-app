<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    public function show(Request $request, User $user)
    {
      $currentUser = $request->user();

      $isFollowing = false;

      if($currentUser) {
        $isFollowing = $currentUser->followings()
        ->where('following_id', $user->id)
        ->exists();
      }
      
      return response() ->json([
        'is_following' =>  $isFollowing,
        'followers_count' => $user->followers()->count(),
      ]);
    }

    public function toggle(Request $request, User $user)
    {
      $currentUser = $request->user();

      if ($currentUser->id === $user->id){
        return response()->json([
          'message' => '自分自身はフォローできません',
        ], 400);
      }
      
      $follow = Follow::where('follower_id', $currentUser->id)
        ->where('following_id', $user->id)
        ->first();

        if ($follow) {
          $follow->delete();

          return response()->json([
            'is_following' => false,
            'followers_count' => $user->followers()->count(),
          ]);
        }

        Follow::create([
        'follower_id' => $currentUser->id,
        'following_id' => $user->id,
        ]);

        return response()->json([
          'is_following' => true,
          'followers_count' => $user->followers()->count(),
        ]);
    }
}
