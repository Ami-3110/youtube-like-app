<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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
      ]);

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
