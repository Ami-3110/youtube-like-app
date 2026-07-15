<?php

namespace Tests\Feature;

use App\Models\Comment;
use App\Models\CommentReaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CommentReactionTest extends TestCase
{
    use RefreshDatabase;

    // コメントのリアクション件数を取得できる
    public function test_comment_reactions_can_be_shown(): void
    {
        $comment = Comment::factory()->create();
        $likeUsers = User::factory()->count(2)->create();
        $dislikeUser = User::factory()->create();

        foreach ($likeUsers as $user) {
            CommentReaction::create([
                'comment_id' => $comment->id,
                'user_id' => $user->id,
                'type' => 'like',
            ]);
        }

        CommentReaction::create([
            'comment_id' => $comment->id,
            'user_id' => $dislikeUser->id,
            'type' => 'dislike',
        ]);

        $response = $this->getJson(
            "/api/comments/{$comment->id}/reactions"
        );

        $response
            ->assertOk()
            ->assertJson([
                'like_count' => 2,
                'dislike_count' => 1,
                'my_reaction' => null,
            ]);
    }

    // ログインユーザー自身のリアクションを取得できる
    public function test_authenticated_user_can_get_own_comment_reaction(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create();

        CommentReaction::create([
            'comment_id' => $comment->id,
            'user_id' => $user->id,
            'type' => 'like',
        ]);

        $this->actingAs($user);

        $response = $this->getJson(
            "/api/comments/{$comment->id}/reactions"
        );

        $response
            ->assertOk()
            ->assertJson([
                'like_count' => 1,
                'dislike_count' => 0,
                'my_reaction' => 'like',
            ]);
    }

    // コメントにリアクションできる
    public function test_authenticated_user_can_react_to_comment(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create();

        $this->actingAs($user);

        $response = $this->postJson(
            "/api/comments/{$comment->id}/reactions",
            [
                'type' => 'like',
            ]
        );

        $response
            ->assertOk()
            ->assertJson([
                'like_count' => 1,
                'dislike_count' => 0,
                'my_reaction' => 'like',
            ]);

        $this->assertDatabaseHas('comment_reactions', [
            'comment_id' => $comment->id,
            'user_id' => $user->id,
            'type' => 'like',
        ]);

        $this->assertDatabaseCount('comment_reactions', 1);
    }

    // 同じリアクションを押すと解除される
    public function test_same_comment_reaction_is_removed_when_toggled_again(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create();

        CommentReaction::create([
            'comment_id' => $comment->id,
            'user_id' => $user->id,
            'type' => 'like',
        ]);

        $this->actingAs($user);

        $response = $this->postJson(
            "/api/comments/{$comment->id}/reactions",
            [
                'type' => 'like',
            ]
        );

        $response
            ->assertOk()
            ->assertJson([
                'like_count' => 0,
                'dislike_count' => 0,
                'my_reaction' => null,
            ]);

        $this->assertDatabaseMissing('comment_reactions', [
            'comment_id' => $comment->id,
            'user_id' => $user->id,
        ]);

        $this->assertDatabaseCount('comment_reactions', 0);
    }

    // 別のリアクションを押すと切り替わる
    public function test_comment_reaction_can_be_switched(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create();

        CommentReaction::create([
            'comment_id' => $comment->id,
            'user_id' => $user->id,
            'type' => 'like',
        ]);

        $this->actingAs($user);

        $response = $this->postJson(
            "/api/comments/{$comment->id}/reactions",
            [
                'type' => 'dislike',
            ]
        );

        $response
            ->assertOk()
            ->assertJson([
                'like_count' => 0,
                'dislike_count' => 1,
                'my_reaction' => 'dislike',
            ]);

        $this->assertDatabaseHas('comment_reactions', [
            'comment_id' => $comment->id,
            'user_id' => $user->id,
            'type' => 'dislike',
        ]);

        /*
         * 新しいレコードを追加するのではなく、
         * 既存の1件を更新したことも確認する。
         */
        $this->assertDatabaseCount('comment_reactions', 1);
    }

    // 不正なリアクションは登録できない
    public function test_comment_reaction_type_must_be_like_or_dislike(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create();

        $this->actingAs($user);

        $response = $this->postJson(
            "/api/comments/{$comment->id}/reactions",
            [
                'type' => 'favorite',
            ]
        );

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('type');

        $this->assertDatabaseCount('comment_reactions', 0);
    }

    // 未ログインユーザーはリアクションを変更できない
    public function test_guest_cannot_react_to_comment(): void
    {
        $comment = Comment::factory()->create();

        $response = $this->postJson(
            "/api/comments/{$comment->id}/reactions",
            [
                'type' => 'like',
            ]
        );

        $response->assertUnauthorized();

        $this->assertDatabaseCount('comment_reactions', 0);
    }
}