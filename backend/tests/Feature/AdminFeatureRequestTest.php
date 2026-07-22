<?php

namespace Tests\Feature;

use App\Models\FeatureRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminFeatureRequestTest extends TestCase
{
    use RefreshDatabase;

    // 管理者は機能リクエスト一覧を新しい順で取得できる
    public function test_admin_can_get_feature_requests_in_latest_order(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $requestUser = User::factory()->create([
            'name' => '要望投稿者',
        ]);

        $oldRequest = FeatureRequest::create([
            'user_id' => $requestUser->id,
            'title' => '古いリクエスト',
            'body' => '古いリクエストの内容',
            'status' => 'pending',
        ]);

        $oldRequest->forceFill([
            'created_at' => now()->subDay(),
            'updated_at' => now()->subDay(),
        ])->save();

        $newRequest = FeatureRequest::create([
            'user_id' => $requestUser->id,
            'title' => '新しいリクエスト',
            'body' => '新しいリクエストの内容',
            'status' => 'reviewing',
        ]);

        $newRequest->forceFill([
            'created_at' => now(),
            'updated_at' => now(),
        ])->save();

        $response = $this
            ->actingAs($admin)
            ->getJson('/api/admin/feature-requests');

        $response
            ->assertOk()
            ->assertJsonPath('data.0.id', $newRequest->id)
            ->assertJsonPath('data.1.id', $oldRequest->id)
            ->assertJsonPath('data.0.user.id', $requestUser->id)
            ->assertJsonPath('per_page', 10);
    }

    // 一般ユーザーは機能リクエスト一覧を取得できない
    public function test_non_admin_cannot_get_feature_requests(): void
    {
        $user = User::factory()->create([
            'is_admin' => false,
        ]);

        $response = $this
            ->actingAs($user)
            ->getJson('/api/admin/feature-requests');

        $response->assertForbidden();
    }

    // 管理者は機能リクエストの状態とコメントを更新できる
    public function test_admin_can_update_feature_request(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $requestUser = User::factory()->create();

        $featureRequest = FeatureRequest::create([
            'user_id' => $requestUser->id,
            'title' => '検索機能を改善してほしい',
            'body' => '海域でも検索できるようにしてほしいです。',
            'status' => 'pending',
        ]);

        $response = $this
            ->actingAs($admin)
            ->patchJson(
                "/api/admin/feature-requests/{$featureRequest->id}",
                [
                    'status' => 'done',
                    'admin_comment' => '対応しました。',
                ]
            );

        $response
            ->assertOk()
            ->assertJson([
                'id' => $featureRequest->id,
                'status' => 'done',
                'admin_comment' => '対応しました。',
            ]);

        $this->assertDatabaseHas('feature_requests', [
            'id' => $featureRequest->id,
            'status' => 'done',
            'admin_comment' => '対応しました。',
        ]);
    }

    // 一般ユーザーは機能リクエストを更新できない
    public function test_non_admin_cannot_update_feature_request(): void
    {
        $user = User::factory()->create([
            'is_admin' => false,
        ]);

        $featureRequest = FeatureRequest::create([
            'user_id' => $user->id,
            'title' => 'テストリクエスト',
            'body' => 'テスト内容',
            'status' => 'pending',
        ]);

        $response = $this
            ->actingAs($user)
            ->patchJson(
                "/api/admin/feature-requests/{$featureRequest->id}",
                [
                    'status' => 'done',
                ]
            );

        $response->assertForbidden();

        $this->assertDatabaseHas('feature_requests', [
            'id' => $featureRequest->id,
            'status' => 'pending',
        ]);
    }

    // 無効なステータスでは更新できない
    public function test_status_must_be_valid(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $requestUser = User::factory()->create();

        $featureRequest = FeatureRequest::create([
            'user_id' => $requestUser->id,
            'title' => 'テストリクエスト',
            'body' => 'テスト内容',
            'status' => 'pending',
        ]);

        $response = $this
            ->actingAs($admin)
            ->patchJson(
                "/api/admin/feature-requests/{$featureRequest->id}",
                [
                    'status' => 'invalid',
                ]
            );

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status');

        $this->assertDatabaseHas('feature_requests', [
            'id' => $featureRequest->id,
            'status' => 'pending',
        ]);
    }

    // 未ログインユーザーは管理者機能を利用できない
    public function test_guest_cannot_access_admin_feature_requests(): void
    {
        $response = $this->getJson('/api/admin/feature-requests');

        $response->assertUnauthorized();
    }
}