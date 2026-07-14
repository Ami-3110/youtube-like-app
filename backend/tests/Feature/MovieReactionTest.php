<?php

namespace Tests\Feature;

use App\Models\Movie;
use App\Models\MovieReaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MovieReactionTest extends TestCase
{
    use RefreshDatabase;

    // リアクション状態取得
    public function test_can_get_movie_reaction_status(): void
    {
        $user = User::factory()->create();
        $movie = Movie::factory()->create();

        MovieReaction::create([
            'movie_id' => $movie->id,
            'user_id' => $user->id,
            'type' => 'like',
        ]);

        $response = $this
            ->actingAs($user)
            ->getJson("/api/movies/{$movie->id}/reactions");

        $response
            ->assertOk()
            ->assertJson([
                'like_count' => 1,
                'dislike_count' => 0,
                'my_reaction' => 'like',
            ]);
    }

    // いいね
    public function test_user_can_like_a_movie(): void
    {
        $user = User::factory()->create();
        $movie = Movie::factory()->create();

        $response = $this
            ->actingAs($user)
            ->postJson("/api/movies/{$movie->id}/reactions", [
                'type' => 'like',
            ]);

        $response
            ->assertOk()
            ->assertJson([
                'like_count' => 1,
                'dislike_count' => 0,
                'my_reaction' => 'like',
            ]);

        $this->assertDatabaseHas('movie_reactions', [
            'movie_id' => $movie->id,
            'user_id' => $user->id,
            'type' => 'like',
        ]);
    }

    // 同じリアクションを押すと解除
    public function test_user_can_remove_like_from_a_movie(): void
    {
        $user = User::factory()->create();
        $movie = Movie::factory()->create();

        MovieReaction::create([
            'movie_id' => $movie->id,
            'user_id' => $user->id,
            'type' => 'like',
        ]);

        $response = $this
            ->actingAs($user)
            ->postJson("/api/movies/{$movie->id}/reactions", [
                'type' => 'like',
            ]);

        $response
            ->assertOk()
            ->assertJson([
                'like_count' => 0,
                'dislike_count' => 0,
                'my_reaction' => null,
            ]);

        $this->assertDatabaseMissing('movie_reactions', [
            'movie_id' => $movie->id,
            'user_id' => $user->id,
        ]);
    }

    // いいねから低評価へ切り替え
    public function test_user_can_change_like_to_dislike(): void
    {
        $user = User::factory()->create();
        $movie = Movie::factory()->create();

        MovieReaction::create([
            'movie_id' => $movie->id,
            'user_id' => $user->id,
            'type' => 'like',
        ]);

        $response = $this
            ->actingAs($user)
            ->postJson("/api/movies/{$movie->id}/reactions", [
                'type' => 'dislike',
            ]);

        $response
            ->assertOk()
            ->assertJson([
                'like_count' => 0,
                'dislike_count' => 1,
                'my_reaction' => 'dislike',
            ]);

        $this->assertDatabaseHas('movie_reactions', [
            'movie_id' => $movie->id,
            'user_id' => $user->id,
            'type' => 'dislike',
        ]);

        $this->assertDatabaseCount('movie_reactions', 1);
    }

    // リアクション種別のバリデーション
    public function test_movie_reaction_type_must_be_like_or_dislike(): void
    {
        $user = User::factory()->create();
        $movie = Movie::factory()->create();

        $response = $this
            ->actingAs($user)
            ->postJson("/api/movies/{$movie->id}/reactions", [
                'type' => 'happy',
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('type');

        $this->assertDatabaseCount('movie_reactions', 0);
    }
}