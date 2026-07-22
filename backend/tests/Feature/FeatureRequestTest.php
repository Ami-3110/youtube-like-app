<?php

namespace Tests\Feature;

use App\Models\FeatureRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FeatureRequestTest extends TestCase
{
    use RefreshDatabase;

    // ログインユーザーは自分の機能リクエスト一覧を新しい順で取得できる
    public function test_authenticated_user_can_get_own_feature_requests(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $oldRequest = FeatureRequest::create([
            'user_id' => $user->id,
            'title' => '古いリクエスト',
            'body' => '古いリクエストの内容',
            'status' => 'pending',
        ]);

        $oldRequest->forceFill([
            'created_at' => now()->subDay(),
            'updated_at' => now()->subDay(),
        ])->save();

        $newRequest = FeatureRequest::create([
            'user_id' => $user->id,
            'title' => '新しいリクエスト',
            'body' => '新しいリクエストの内容',
            'status' => 'reviewing',
        ]);

        $newRequest->forceFill([
            'created_at' => now(),
            'updated_at' => now(),
        ])->save();

        FeatureRequest::create([
            'user_id' => $otherUser->id,
            'title' => '他人のリクエスト',
            'body' => '他人のリクエストの内容',
            'status' => 'pending',
        ]);

        $response = $this
            ->actingAs($user)
            ->getJson('/api/me/feature-requests');

        $response
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonPath('0.id', $newRequest->id)
            ->assertJsonPath('1.id', $oldRequest->id)
            ->assertJsonMissing([
                'title' => '他人のリクエスト',
            ]);
    }

    // 未ログインユーザーは機能リクエスト一覧を取得できない
    public function test_guest_cannot_get_feature_requests(): void
    {
        $response = $this->getJson('/api/me/feature-requests');

        $response->assertUnauthorized();
    }

    // ログインユーザーは機能リクエストを投稿できる
    public function test_authenticated_user_can_create_feature_request(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->postJson('/api/feature-requests', [
                'title' => 'ダークモードを追加してほしい',
                'body' => '画面をダークモードに切り替えられるようにしてほしいです。',
            ]);

        $response
            ->assertCreated()
            ->assertJson([
                'user_id' => $user->id,
                'title' => 'ダークモードを追加してほしい',
                'body' => '画面をダークモードに切り替えられるようにしてほしいです。',
                'status' => 'pending',
            ]);

        $this->assertDatabaseHas('feature_requests', [
            'user_id' => $user->id,
            'title' => 'ダークモードを追加してほしい',
            'body' => '画面をダークモードに切り替えられるようにしてほしいです。',
            'status' => 'pending',
        ]);
    }

    // 未ログインユーザーは機能リクエストを投稿できない
    public function test_guest_cannot_create_feature_request(): void
    {
        $response = $this->postJson('/api/feature-requests', [
            'title' => 'ダークモードを追加してほしい',
            'body' => '画面をダークモードに切り替えられるようにしてほしいです。',
        ]);

        $response->assertUnauthorized();

        $this->assertDatabaseCount('feature_requests', 0);
    }

    // titleとbodyは必須
    public function test_title_and_body_are_required(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->postJson('/api/feature-requests', []);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'title',
                'body',
            ]);

        $this->assertDatabaseCount('feature_requests', 0);
    }

    // 投稿者本人は機能リクエストを取り下げられる
    public function test_owner_can_withdraw_feature_request(): void
    {
        $user = User::factory()->create();

        $featureRequest = FeatureRequest::create([
            'user_id' => $user->id,
            'title' => '取り下げるリクエスト',
            'body' => 'このリクエストを取り下げます。',
            'status' => 'pending',
        ]);

        $response = $this
            ->actingAs($user)
            ->patchJson(
                "/api/feature-requests/{$featureRequest->id}/withdraw"
            );

        $response
            ->assertOk()
            ->assertJson([
                'id' => $featureRequest->id,
                'status' => 'withdrawn',
            ]);

        $this->assertDatabaseHas('feature_requests', [
            'id' => $featureRequest->id,
            'user_id' => $user->id,
            'status' => 'withdrawn',
        ]);
    }

    // 他人の機能リクエストは取り下げられない
    public function test_user_cannot_withdraw_another_users_feature_request(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $featureRequest = FeatureRequest::create([
            'user_id' => $otherUser->id,
            'title' => '他人のリクエスト',
            'body' => '他人が投稿したリクエストです。',
            'status' => 'pending',
        ]);

        $response = $this
            ->actingAs($user)
            ->patchJson(
                "/api/feature-requests/{$featureRequest->id}/withdraw"
            );

        $response->assertForbidden();

        $this->assertDatabaseHas('feature_requests', [
            'id' => $featureRequest->id,
            'status' => 'pending',
        ]);
    }

    // 完了・却下・取り下げ済みのリクエストは取り下げられない
    public function test_finished_feature_request_cannot_be_withdrawn(): void
    {
        $user = User::factory()->create();

        foreach (['done', 'rejected', 'withdrawn'] as $status) {
            $featureRequest = FeatureRequest::create([
                'user_id' => $user->id,
                'title' => "{$status}のリクエスト",
                'body' => '取り下げできないリクエストです。',
                'status' => $status,
            ]);

            $response = $this
                ->actingAs($user)
                ->patchJson(
                    "/api/feature-requests/{$featureRequest->id}/withdraw"
                );

            $response
                ->assertUnprocessable()
                ->assertJson([
                    'message' => 'このリクエストは取り下げできません',
                ]);

            $this->assertDatabaseHas('feature_requests', [
                'id' => $featureRequest->id,
                'status' => $status,
            ]);
        }
    }

    // 未ログインユーザーは機能リクエストを取り下げられない
    public function test_guest_cannot_withdraw_feature_request(): void
    {
        $user = User::factory()->create();

        $featureRequest = FeatureRequest::create([
            'user_id' => $user->id,
            'title' => '取り下げ対象',
            'body' => '未ログインでは取り下げられません。',
            'status' => 'pending',
        ]);

        $response = $this->patchJson(
            "/api/feature-requests/{$featureRequest->id}/withdraw"
        );

        $response->assertUnauthorized();

        $this->assertDatabaseHas('feature_requests', [
            'id' => $featureRequest->id,
            'status' => 'pending',
        ]);
    }
}