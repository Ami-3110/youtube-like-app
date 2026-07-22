<?php

namespace Tests\Feature;

use App\Models\Movie;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserTest extends TestCase
{
    use RefreshDatabase;

    // 管理者はユーザー一覧をID順で取得できる
    public function test_admin_can_get_users_in_id_order(): void
    {
        $admin = User::factory()->create([
            'name' => '管理者',
            'is_admin' => true,
        ]);

        $user1 = User::factory()->create([
            'name' => 'デモ美',
            'is_admin' => false,
        ]);

        $user2 = User::factory()->create([
            'name' => 'デモ也',
            'is_admin' => false,
        ]);

        Movie::factory()->count(2)->create([
            'user_id' => $user1->id,
        ]);

        Movie::factory()->create([
            'user_id' => $user2->id,
        ]);

        $response = $this
            ->actingAs($admin)
            ->getJson('/api/admin/users');

        $response
            ->assertOk()
            ->assertJsonCount(3)
            ->assertJsonPath('0.id', $admin->id)
            ->assertJsonPath('1.id', $user1->id)
            ->assertJsonPath('1.name', 'デモ美')
            ->assertJsonPath('1.movies_count', 2)
            ->assertJsonPath('2.id', $user2->id)
            ->assertJsonPath('2.name', 'デモ也')
            ->assertJsonPath('2.movies_count', 1);
    }

    // 一般ユーザーはユーザー一覧を取得できない
    public function test_non_admin_cannot_get_users(): void
    {
        $user = User::factory()->create([
            'is_admin' => false,
        ]);

        $response = $this
            ->actingAs($user)
            ->getJson('/api/admin/users');

        $response->assertForbidden();
    }

    // 管理者は他のユーザーを削除できる
    public function test_admin_can_delete_another_user(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $user = User::factory()->create([
            'is_admin' => false,
        ]);

        $response = $this
            ->actingAs($admin)
            ->deleteJson("/api/admin/users/{$user->id}");

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'User deleted',
            ]);

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }

    // 管理者は自分自身を削除できない
    public function test_admin_cannot_delete_self(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $response = $this
            ->actingAs($admin)
            ->deleteJson("/api/admin/users/{$admin->id}");

        $response
            ->assertUnprocessable()
            ->assertJson([
                'message' => '自分自身は削除できません',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $admin->id,
        ]);
    }

    // 一般ユーザーは他のユーザーを削除できない
    public function test_non_admin_cannot_delete_user(): void
    {
        $user = User::factory()->create([
            'is_admin' => false,
        ]);

        $targetUser = User::factory()->create([
            'is_admin' => false,
        ]);

        $response = $this
            ->actingAs($user)
            ->deleteJson("/api/admin/users/{$targetUser->id}");

        $response->assertForbidden();

        $this->assertDatabaseHas('users', [
            'id' => $targetUser->id,
        ]);
    }

    // 未ログインユーザーは管理者用ユーザー機能を利用できない
    public function test_guest_cannot_access_admin_users(): void
    {
        $response = $this->getJson('/api/admin/users');

        $response->assertUnauthorized();
    }

    // 存在しないユーザーは削除できない
    public function test_admin_cannot_delete_nonexistent_user(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $response = $this
            ->actingAs($admin)
            ->deleteJson('/api/admin/users/999');

        $response->assertNotFound();
    }
}