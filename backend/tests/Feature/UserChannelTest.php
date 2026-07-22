<?php

namespace Tests\Feature;

use App\Models\Follow;
use App\Models\Movie;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserChannelTest extends TestCase
{
    use RefreshDatabase;

    // ユーザーのチャンネル情報とフォロワー数を取得できる
    public function test_user_channel_can_be_get(): void
    {
        $user = User::factory()->create([
            'name' => 'Ami',
            'handle' => 'adminAmi',
            'bio' => '海とダイビングが好きです。',
            'avatar_path' => 'avatars/admin.png',
        ]);

        $follower1 = User::factory()->create();
        $follower2 = User::factory()->create();

        Follow::create([
            'follower_id' => $follower1->id,
            'following_id' => $user->id,
        ]);

        Follow::create([
            'follower_id' => $follower2->id,
            'following_id' => $user->id,
        ]);

        $response = $this->getJson("/api/users/{$user->id}/channel");

        $response
            ->assertOk()
            ->assertJson([
                'id' => $user->id,
                'name' => 'Ami',
                'handle' => 'adminAmi',
                'bio' => '海とダイビングが好きです。',
                'avatar_path' => 'avatars/admin.png',
                'followers_count' => 2,
                'movies' => [],
            ]);
    }

    // 投稿動画を新しい順で取得し、動画ごとのトピックも取得できる
    public function test_channel_movies_are_returned_in_latest_order_with_topics(): void
    {
        $user = User::factory()->create();

        $oldMovie = Movie::factory()->create([
            'user_id' => $user->id,
            'title' => '西川名ダイビング',
            'thumbnail_path' => 'thumbnails/nishikawana.jpg',
            'views' => 10,
        ]);

        $oldMovie->forceFill([
            'created_at' => now()->subDay(),
            'updated_at' => now()->subDay(),
        ])->save();

        $newMovie = Movie::factory()->create([
            'user_id' => $user->id,
            'title' => '神子元ハンマーヘッド',
            'thumbnail_path' => 'thumbnails/mikomoto.jpg',
            'views' => 100,
        ]);

        $newMovie->forceFill([
            'created_at' => now(),
            'updated_at' => now(),
        ])->save();

        $sharkTopic = Topic::create([
            'name' => 'サメ',
        ]);

        $driftTopic = Topic::create([
            'name' => 'ドリフトダイビング',
        ]);

        $newMovie->topics()->attach([
            $sharkTopic->id,
            $driftTopic->id,
        ]);

        $response = $this->getJson("/api/users/{$user->id}/channel");

        $response
            ->assertOk()
            ->assertJsonCount(2, 'movies')
            ->assertJsonPath('movies.0.id', $newMovie->id)
            ->assertJsonPath('movies.0.title', '神子元ハンマーヘッド')
            ->assertJsonPath('movies.0.views', 100)
            ->assertJsonPath('movies.0.topics.0.id', $sharkTopic->id)
            ->assertJsonPath('movies.0.topics.0.name', 'サメ')
            ->assertJsonPath('movies.0.topics.1.id', $driftTopic->id)
            ->assertJsonPath(
                'movies.0.topics.1.name',
                'ドリフトダイビング'
            )
            ->assertJsonPath('movies.1.id', $oldMovie->id)
            ->assertJsonPath('movies.1.title', '西川名ダイビング');
    }

    // 存在しないユーザーのチャンネルは取得できない
    public function test_nonexistent_user_channel_returns_not_found(): void
    {
        $response = $this->getJson('/api/users/999/channel');

        $response->assertNotFound();
    }
}