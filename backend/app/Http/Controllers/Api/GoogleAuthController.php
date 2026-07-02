<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
      return Socialite::driver('google')->redirect();
    }

    public function callback(Request $request)
    {
      $googleUser = Socialite::driver('google')->user();

      $user = User::where('google_id', $googleUser->getId())
        ->orWhere('emeil', $googleUser->getEmail())
        ->first();

      if($user){
        $user->update([
          'google_id' => $googleUser->getId(),
        ]);
      } else {
        $user = User::create([
          'name' => $googleUser->getName() ?? $googleUser->getNickname() ?? 'Google User',
          'email' => $googleUser->getEmail(),
          'google_id' => $googleUser->getId(),
          'password' => bcrypt(Str::random(32)),
        ]);
      }

      Auth::login($user);

      return redirect(config('app.frontend_url') . '/dashboard');
    }
}
