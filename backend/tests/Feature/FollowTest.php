<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Follow;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FollowTest extends TestCase
{
    use RefreshDatabase;

    // 他のユーザーをフォロー
    public function test_user_can_follow_another_user(): void
    {
        $follower = User::factory()->create();
        $targetUser = User::factory()->create();

        $response = $this
            ->actingAs($follower)
            ->postJson("/api/users/{$targetUser->id}/follow");

        $response
            ->assertOk()
            ->assertJson([
                'is_following' => true,
                'followers_count' => 1,
            ]);

        $this->assertDatabaseHas('follows', [
            'follower_id' => $follower->id,
            'following_id' => $targetUser->id,
        ]);
    }

  // フォロー解除
  public function test_user_can_unfollow_a_user(): void
  {
      $follower = User::factory()->create();
      $targetUser = User::factory()->create();

      Follow::create([
          'follower_id' => $follower->id,
          'following_id' => $targetUser->id,
      ]);

      $response = $this
          ->actingAs($follower)
          ->postJson("/api/users/{$targetUser->id}/follow");

      $response
          ->assertOk()
          ->assertJson([
              'is_following' => false,
              'followers_count' => 0,
          ]);

      $this->assertDatabaseMissing('follows', [
          'follower_id' => $follower->id,
          'following_id' => $targetUser->id,
      ]);
  }

  // 自分自身はフォローできない
  public function test_user_cannot_follow_themselves(): void
  {
      $user = User::factory()->create();

      $response = $this
          ->actingAs($user)
          ->postJson("/api/users/{$user->id}/follow");

      $response
          ->assertStatus(400)
          ->assertJson([
              'message' => '自分自身はフォローできません',
          ]);

      $this->assertDatabaseCount('follows', 0);
  }

  // フォロー状況とフォロワー数の取得
  public function test_can_get_follow_status(): void
  {
    $follower = User::factory()->create();
    $targetUser = User::factory()->create();

    Follow::create([
      'follower_id' => $follower->id,
      'following_id' => $targetUser->id,
    ]);

    $response = $this
      ->actingAs($follower)
      ->getJson("/api/users/{$targetUser->id}/follow");

    $response
      ->assertOk()
      ->assertJson([
          'is_following' => true,
          'followers_count' => 1,
      ]);
  }

  // 自分がフォロー中のユーザー一覧取得
  public function test_user_can_get_following_list(): void
  {
      $currentUser = User::factory()->create();
      $followingUser = User::factory()->create([
          'name' => 'フォロー中ユーザー',
      ]);

      Follow::create([
          'follower_id' => $currentUser->id,
          'following_id' => $followingUser->id,
      ]);

      $response = $this
          ->actingAs($currentUser)
          ->getJson('/api/me/following');

      $response
          ->assertOk()
          ->assertJsonCount(1)
          ->assertJsonFragment([
              'id' => $followingUser->id,
              'name' => 'フォロー中ユーザー',
          ])
          ->assertJsonStructure([
              '*' => [
                  'id',
                  'name',
                  'avatar_path',
              ],
          ]);
  }
}
