<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Movie;
use App\Models\Comment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CommentTest extends TestCase
{
  use RefreshDatabase;    

  // コメント一覧取得（返信を含む）
  public function test_can_get_comment_list(): void
  {
      $user = User::factory()->create();

      $movie = Movie::factory()->create();

      $parent = Comment::factory()->create([
          'user_id' => $user->id,
          'movie_id' => $movie->id,
          'parent_id' => null,
          'body' => '親コメント',
      ]);

      Comment::factory()->create([
          'user_id' => $user->id,
          'movie_id' => $movie->id,
          'parent_id' => $parent->id,
          'body' => '返信コメント',
      ]);

      $response = $this->getJson("/api/movies/{$movie->id}/comments");

      $response
          ->assertOk()
          ->assertJsonCount(1) // 親コメントだけ返る
          ->assertJsonStructure([
              '*' => [
                  'id',
                  'body',
                  'user' => [
                      'id',
                      'name',
                  ],
                  'replies' => [
                      '*' => [
                          'id',
                          'body',
                          'parent_id',
                          'user' => [
                              'id',
                              'name',
                          ],
                      ],
                  ],
              ],
          ])
          ->assertJsonFragment([
              'body' => '親コメント',
          ])
          ->assertJsonFragment([
              'body' => '返信コメント',
          ]);
  }

  // コメント投稿
  public function test_user_can_post_comment(): void
  {
      $user = User::factory()->create();

      $movie = Movie::factory()->create();

      $response = $this
          ->actingAs($user)
          ->postJson("/api/movies/{$movie->id}/comments", [
              'body' => 'テストコメント',
          ]);

      $response
          ->assertCreated()
          ->assertJson([
              'body' => 'テストコメント',
          ]);

      $this->assertDatabaseHas('comments', [
          'user_id' => $user->id,
          'movie_id' => $movie->id,
          'parent_id' => null,
          'body' => 'テストコメント',
      ]);
  }

// body必須
  public function test_comment_body_is_required(): void
  {
      $user = User::factory()->create();

      $movie = Movie::factory()->create();

      $response = $this
          ->actingAs($user)
          ->postJson("/api/movies/{$movie->id}/comments", [
              // bodyなし
          ]);

      $response
          ->assertUnprocessable()
          ->assertJsonValidationErrors('body');

      $this->assertDatabaseCount('comments', 0);
  }

  // 返信コメント投稿
  public function test_user_can_post_reply_comment(): void
  {
      $user = User::factory()->create();

      $movie = Movie::factory()->create();

      $parentComment = Comment::factory()->create([
          'movie_id' => $movie->id,
          'parent_id' => null,
          'body' => '親コメント',
      ]);

      $response = $this
          ->actingAs($user)
          ->postJson("/api/movies/{$movie->id}/comments", [
              'body' => '返信コメント',
              'parent_id' => $parentComment->id,
          ]);

      $response
          ->assertCreated()
          ->assertJson([
              'body' => '返信コメント',
              'parent_id' => $parentComment->id,
          ]);

      $this->assertDatabaseHas('comments', [
          'movie_id' => $movie->id,
          'user_id' => $user->id,
          'parent_id' => $parentComment->id,
          'body' => '返信コメント',
      ]);
  }

  // 本人によるコメント編集
  public function test_user_can_update_own_comment(): void
  {
      $user = User::factory()->create();

      $movie = Movie::factory()->create();

      $comment = Comment::factory()->create([
          'movie_id' => $movie->id,
          'user_id' => $user->id,
          'body' => '編集前のコメント',
      ]);

      $response = $this
          ->actingAs($user)
          ->patchJson("/api/comments/{$comment->id}", [
              'body' => '編集後のコメント',
          ]);

      $response
          ->assertOk()
          ->assertJson([
              'id' => $comment->id,
              'body' => '編集後のコメント',
          ]);

      $this->assertDatabaseHas('comments', [
          'id' => $comment->id,
          'movie_id' => $movie->id,
          'user_id' => $user->id,
          'body' => '編集後のコメント',
      ]);
  }

  // 第三者によるコメント編集不可
  public function test_user_cannot_update_another_users_comment(): void
  {
      $owner = User::factory()->create();
      $otherUser = User::factory()->create();

      $movie = Movie::factory()->create();

      $comment = Comment::factory()->create([
          'movie_id' => $movie->id,
          'user_id' => $owner->id,
          'body' => '元のコメント',
      ]);

      $response = $this
          ->actingAs($otherUser)
          ->patchJson("/api/comments/{$comment->id}", [
              'body' => '勝手に変更したコメント',
          ]);

      $response
          ->assertForbidden()
          ->assertJson([
              'message' => '権限がありません',
          ]);

      $this->assertDatabaseHas('comments', [
          'id' => $comment->id,
          'user_id' => $owner->id,
          'body' => '元のコメント',
      ]);
  }

  // 本人によるコメント削除
  public function test_user_can_delete_own_comment(): void
  {
      $user = User::factory()->create();

      $movie = Movie::factory()->create();

      $comment = Comment::factory()->create([
          'movie_id' => $movie->id,
          'user_id' => $user->id,
          'body' => '削除するコメント',
      ]);

      $response = $this
          ->actingAs($user)
          ->deleteJson("/api/comments/{$comment->id}");

      $response
          ->assertOk()
          ->assertJson([
              'message' => 'Comment deleted',
          ]);

      $this->assertDatabaseMissing('comments', [
          'id' => $comment->id,
      ]);
  }

  // 第三者によるコメント削除
  public function test_user_cannot_delete_another_users_comment(): void
  {
      $owner = User::factory()->create();
      $otherUser = User::factory()->create();

      $movie = Movie::factory()->create();

      $comment = Comment::factory()->create([
          'movie_id' => $movie->id,
          'user_id' => $owner->id,
          'body' => '削除するコメント',
      ]);

      $response = $this
          ->actingAs($otherUser)
          ->deleteJson("/api/comments/{$comment->id}");

      $response->assertForbidden();

      $this->assertDatabaseHas('comments', [
          'id' => $comment->id,
          'user_id' => $owner->id,
          'body' => '削除するコメント',
      ]);
  }

  // 管理者による第三者のコメント削除
  public function test_admin_can_delete_another_users_comment(): void
  {
      $admin = User::factory()->create([
          'is_admin' => true,
      ]);
      $owner = User::factory()->create();

      $movie = Movie::factory()->create();

      $comment = Comment::factory()->create([
          'movie_id' => $movie->id,
          'user_id' => $owner->id,
          'body' => '削除するコメント',
      ]);

      $response = $this
          ->actingAs($admin)
          ->deleteJson("/api/comments/{$comment->id}");

      $response
          ->assertOk()
          ->assertJson([
              'message' => 'Comment deleted',
          ]);

      $this->assertDatabaseMissing('comments', [
          'id' => $comment->id,
      ]);
  }
}
