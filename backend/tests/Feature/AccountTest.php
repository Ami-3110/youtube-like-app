<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AccountTest extends TestCase
{
    use RefreshDatabase;

    // ログインユーザーはメールアドレスを変更できる
    public function test_authenticated_user_can_update_email(): void
    {
        $user = User::factory()->create([
            'email' => 'old@example.com',
        ]);

        $this->actingAs($user);

        $response = $this->patchJson('/api/me/email', [
            'email' => 'new@example.com',
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Email updated',
                'user' => [
                    'id' => $user->id,
                    'email' => 'new@example.com',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'email' => 'new@example.com',
        ]);
    }

    // 自分が現在使用しているメールアドレスにも更新できる
    public function test_user_can_keep_their_current_email(): void
    {
        $user = User::factory()->create([
            'email' => 'same@example.com',
        ]);

        $this->actingAs($user);

        $response = $this->patchJson('/api/me/email', [
            'email' => 'same@example.com',
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Email updated',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'email' => 'same@example.com',
        ]);
    }

    // 他のユーザーが使用しているメールアドレスには変更できない
    public function test_email_must_be_unique_except_for_current_user(): void
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
        ]);

        User::factory()->create([
            'email' => 'already-used@example.com',
        ]);

        $this->actingAs($user);

        $response = $this->patchJson('/api/me/email', [
            'email' => 'already-used@example.com',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'email' => 'user@example.com',
        ]);
    }

    // 不正な形式のメールアドレスには変更できない
    public function test_email_must_be_valid(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->patchJson('/api/me/email', [
            'email' => 'invalid-email',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    // ログインユーザーはパスワードを変更できる
    public function test_authenticated_user_can_update_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('CurrentPassword123!'),
        ]);

        $this->actingAs($user);

        $response = $this->patchJson('/api/me/password', [
            'current_password' => 'CurrentPassword123!',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Password updated',
            ]);

        $user->refresh();

        $this->assertTrue(
            Hash::check('NewPassword123!', $user->password)
        );

        $this->assertFalse(
            Hash::check('CurrentPassword123!', $user->password)
        );
    }

    // 現在のパスワードが間違っている場合は変更できない
    public function test_password_cannot_be_updated_when_current_password_is_wrong(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('CurrentPassword123!'),
        ]);

        $this->actingAs($user);

        $response = $this->patchJson('/api/me/password', [
            'current_password' => 'WrongPassword123!',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJson([
                'message' => '現在のパスワードが正しくありません',
            ]);

        $user->refresh();

        $this->assertTrue(
            Hash::check('CurrentPassword123!', $user->password)
        );
    }

    // パスワード確認欄が一致しない場合は変更できない
    public function test_password_confirmation_must_match(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('CurrentPassword123!'),
        ]);

        $this->actingAs($user);

        $response = $this->patchJson('/api/me/password', [
            'current_password' => 'CurrentPassword123!',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'DifferentPassword123!',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('password');

        $user->refresh();

        $this->assertTrue(
            Hash::check('CurrentPassword123!', $user->password)
        );
    }

    // ログインユーザーはアカウントを削除できる
    public function test_authenticated_user_can_delete_account(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->deleteJson('/api/me/account');

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Account deleted',
            ]);

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }

    // 未ログインユーザーはメールアドレスを変更できない
    public function test_guest_cannot_update_email(): void
    {
        $response = $this->patchJson('/api/me/email', [
            'email' => 'new@example.com',
        ]);

        $response->assertUnauthorized();
    }

    // 未ログインユーザーはパスワードを変更できない
    public function test_guest_cannot_update_password(): void
    {
        $response = $this->patchJson('/api/me/password', [
            'current_password' => 'CurrentPassword123!',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response->assertUnauthorized();
    }

    // 未ログインユーザーはアカウントを削除できない
    public function test_guest_cannot_delete_account(): void
    {
        $response = $this->deleteJson('/api/me/account');

        $response->assertUnauthorized();
    }
}