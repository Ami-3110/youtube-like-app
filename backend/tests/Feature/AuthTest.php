<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

  // ユーザー登録
  public function test_user_can_register(): void
  {
      $response = $this->postJson('/api/register', [
          'name' => 'テストユーザー',
          'email' => 'test@example.com',
          'password' => 'password123',
          'password_confirmation' => 'password123',
      ]);

      $response
          ->assertCreated()
          ->assertJson([
              'message' => '登録しました',
          ]);

      $this->assertDatabaseHas('users', [
          'name' => 'テストユーザー',
          'email' => 'test@example.com',
      ]);

      $user = \App\Models\User::where('email', 'test@example.com')->first();

      $this->assertTrue(
          Hash::check('password123', $user->password)
      );
  }

  // メール必須
  public function test_email_is_required_when_registering(): void
  {
    $response = $this->postJson('/api/register', [
      'name' => 'テストユーザー',
      // 'email' なし
      'password' => 'password123',
      'password_confirmation' => 'password123',
    ]);
    $response
      ->assertUnprocessable()
      ->assertJsonValidationErrors('email');

    $this->assertDatabaseCount('users', 0);
  }

  // メール重複不可
  public function test_email_must_be_unique(): void
  {
    \App\Models\User::factory()->create([
        'email' => 'test@example.com',
    ]);

    $response = $this->postJson('/api/register', [
        'name' => '別のテストユーザー',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors('email');

    $this->assertDatabaseCount('users', 1);
  }

  // パスワード確認
  public function test_password_confirmation_must_match(): void
  {
    $response = $this->postJson('/api/register', [
      'name' => 'テストユーザー',
      'email' => 'test@example.com',
      'password' => 'password123',
      'password_confirmation' => 'password345',
    ]);

    $response
      ->assertUnprocessable()
      ->assertJsonValidationErrors('password');

    $this->assertDatabaseCount('users', 0);
  }

  // パスワード８字以上
  public function test_password_must_be_at_least_8_characters(): void
  {
    $response = $this->postJson('/api/register', [
      'name' => 'テストユーザー',
      'email' => 'test@example.com',
      'password' => 'pass',
      'password_confirmation' => 'pass',
    ]);

    $response
      ->assertUnprocessable()
      ->assertJsonValidationErrors('password');

    $this->assertDatabaseCount('users', 0);
  }

  // ログイン
  public function test_user_can_login(): void
  {
      $password = 'password123';

      $user = \App\Models\User::factory()->create([
          'email' => 'test@example.com',
          'password' => Hash::make($password),
      ]);

      $response = $this
        ->withHeader('Origin', config('app.frontend_url'))
        ->postJson('/api/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

      $response
          ->assertOk()
          ->assertJson([
              'message' => 'ログイン成功',
          ]);

      $this->assertAuthenticatedAs($user);
  }

  // メール必須
  public function test_email_is_required_for_login(): void
  {
    $password = 'password123';

    $user = \App\Models\User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make($password),
    ]);

    $response = $this
      ->withHeader('Origin', config('app.frontend_url'))
      ->postJson('/api/login', [
        // 'email' なし
        'password' => $password,
      ]);

    $response
      ->assertUnprocessable()
      ->assertJsonValidationErrors('email');
  }

  // パスワード不一致
  public function test_user_cannot_login_with_wrong_password(): void
  {
    $password = 'password123';

    $user = \App\Models\User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make($password),
    ]);

    $response = $this
      ->withHeader('Origin', config('app.frontend_url'))
      ->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'wrongpassword',
      ]);

    $response
      ->assertStatus(422)
      ->assertJson([
        'message' => '認証に失敗しました',
      ]);

    $this->assertGuest();
  }

  public function test_user_can_logout(): void
  {
    $user = User::factory()->create();

    $response = $this
      ->actingAs($user)
      ->withHeader('Origin', config('app.frontend_url'))
      ->postJson('/api/logout');
      
    $response
        ->assertOk()
        ->assertJson([
          'message' => 'ログアウト成功',
      ]);
  }
}