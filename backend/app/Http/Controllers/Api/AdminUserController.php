<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user()->is_admin) {
            abort(403);
        }

        return User::withCount('movies')
            ->orderBy('id')
            ->get();
    }

    public function destroy(Request $request, User $user)
    {
        if (!$request->user()->is_admin) {
            abort(403);
        }

        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => '自分自身は削除できません',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted',
        ]);
    }
}