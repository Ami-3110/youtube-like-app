<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
      $user = $request->user();

      $validated = $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'handle' => [
          'nullable',
          'string',
          'max:50',
          Rule::unique('users', 'handle')->ignore($user->id),
        ],
        'bio' => ['nullable', 'string', 'max:1000'],
        'avatar' => ['nullable', 'image', 'max:5120'],
      ]);
      if ($request->hasFile('avatar')) {

        if ($user->avatar_path) {
            Storage::disk('public')->delete(
                str_replace('/storage/', '', $user->avatar_path)
            );
        }

        $avatarPath = $request->file('avatar')->store('avatars', 'public');

        $validated['avatar_path'] = '/storage/' . $avatarPath;
      }

      $user->update($validated);

      return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'handle' => $user->handle,
        'bio' => $user->bio,
        'avatar_path' => $user->avatar_path,
        'is_admin' => $user->is_admin,
      ]);
    }
}
