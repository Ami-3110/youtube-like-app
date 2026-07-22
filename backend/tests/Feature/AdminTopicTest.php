<?php

namespace Tests\Feature;

use App\Models\Topic;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTopicTest extends TestCase
{
    use RefreshDatabase;

    // 管理者はトピック一覧を名前順で取得できる
    public function test_admin_can_get_topics_in_name_order(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        Topic::create([
            'name' => '沈船',
        ]);

        Topic::create([
            'name' => 'サメ',
        ]);

        Topic::create([
            'name' => 'ウミウシ',
        ]);

        $response = $this
            ->actingAs($admin)
            ->getJson('/api/admin/topics');

        $response
            ->assertOk()
            ->assertJsonCount(3)
            ->assertJsonPath('0.name', 'ウミウシ')
            ->assertJsonPath('1.name', 'サメ')
            ->assertJsonPath('2.name', '沈船');
    }

    // 管理者はトピックを作成できる
    public function test_admin_can_create_topic(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $response = $this
            ->actingAs($admin)
            ->postJson('/api/admin/topics', [
                'name' => 'ハンマーヘッドシャーク',
            ]);

        $response
            ->assertCreated()
            ->assertJson([
                'name' => 'ハンマーヘッドシャーク',
            ]);

        $this->assertDatabaseHas('topics', [
            'name' => 'ハンマーヘッドシャーク',
        ]);
    }

    // トピック名は必須で重複できない
    public function test_topic_name_is_required_and_must_be_unique(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        Topic::create([
            'name' => 'サメ',
        ]);

        $requiredResponse = $this
            ->actingAs($admin)
            ->postJson('/api/admin/topics', []);

        $requiredResponse
            ->assertUnprocessable()
            ->assertJsonValidationErrors('name');

        $duplicateResponse = $this
            ->actingAs($admin)
            ->postJson('/api/admin/topics', [
                'name' => 'サメ',
            ]);

        $duplicateResponse
            ->assertUnprocessable()
            ->assertJsonValidationErrors('name');

        $this->assertDatabaseCount('topics', 1);
    }

    // 管理者はトピックを削除できる
    public function test_admin_can_delete_topic(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $topic = Topic::create([
            'name' => '期間限定トピック',
        ]);

        $response = $this
            ->actingAs($admin)
            ->deleteJson("/api/admin/topics/{$topic->id}");

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Topic deleted',
            ]);

        $this->assertDatabaseMissing('topics', [
            'id' => $topic->id,
        ]);
    }

    // 一般ユーザーは管理者用トピック機能を利用できない
    public function test_non_admin_cannot_manage_topics(): void
    {
        $user = User::factory()->create([
            'is_admin' => false,
        ]);

        $topic = Topic::create([
            'name' => 'サメ',
        ]);

        $this
            ->actingAs($user)
            ->getJson('/api/admin/topics')
            ->assertForbidden();

        $this
            ->actingAs($user)
            ->postJson('/api/admin/topics', [
                'name' => 'マンタ',
            ])
            ->assertForbidden();

        $this
            ->actingAs($user)
            ->deleteJson("/api/admin/topics/{$topic->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('topics', [
            'id' => $topic->id,
        ]);

        $this->assertDatabaseMissing('topics', [
            'name' => 'マンタ',
        ]);
    }

    // 未ログインユーザーは管理者用トピック機能を利用できない
    public function test_guest_cannot_access_admin_topics(): void
    {
        $response = $this->getJson('/api/admin/topics');

        $response->assertUnauthorized();
    }
}