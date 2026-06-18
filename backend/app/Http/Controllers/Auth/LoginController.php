<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function store(Request $request)
    {
      $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
      ]);

      if(! Auth::attempt($credentials)) {
        return response()->json([
          'message' => '認証に失敗しました',
        ], 422);
      }

      $request->session()->regenerate();

      return response()->json([
        'message' => 'ログイン成功',
      ]);
    }

    public function destroy(Request $request)
    {
      Auth::guard('web')->logout();

      $request->session()->invalidate();
      $request->session()->regenerateToken();

      return response()->json([
        'message' => 'ログアウト成功'
      ]);
    }
}
