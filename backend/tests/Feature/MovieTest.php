<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Movie;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class MovieTest extends TestCase
{
  use RefreshDatabase;

  // 一覧取得
  public function test_can_get_movie_list(): void
  {
    Movie::factory()->create([
      'title' => 'テスト動画',
    ]);

    $response = $this->getJson('/api/movies');

    $response
      ->assertStatus(200)
      ->assertJsonStructure([
        '*' => [
          'id',
          'title',
        ]
      ])
      ->assertJsonFragment([
        'title' => 'テスト動画',
      ]);
  }

  // 詳細取得
  public function test_can_get_movie_detail(): void
  {
    $movie = Movie::factory()->create([
      'title' => 'test_movie_detail',
      'views' => 0,
    ]);

    $response = $this->getJson("/api/movies/{$movie->id}");

    $response
      ->assertStatus(200)
      ->assertJsonFragment([
        'id' => $movie->id,
        'title' => 'test_movie_detail',
        'views' => 1,
      ]);
  }

  // 存在しない動画は404
  public function test_returns_404_when_movie_not_found(): void
  {
        $response = $this->getJson('/api/movies/1');

        $response->assertStatus(404);
  }

  // 動画投稿
  public function test_registered_user_can_upload_a_movie(): void
  {
      Storage::fake('public');

      $user = User::factory()->create();

      $movieFile = UploadedFile::fake()->create(
          'sample.mp4',
          1024,
          'video/mp4'
      );

      $thumbnailFile = UploadedFile::fake()->image('thumbnail.jpg');

      $response = $this
          ->actingAs($user)
          ->postJson('/api/movies', [
              'title' => 'テスト動画',
              'movie' => $movieFile,
              'thumbnail' => $thumbnailFile,
          ]);

      $response->assertCreated();

      $this->assertDatabaseHas('movies', [
          'user_id' => $user->id,
          'title' => 'テスト動画',
          'description' => null,
      ]);

      $moviePath = $response->json('movie_path');

      $this->assertTrue(
          Storage::disk('public')->exists(
              str_replace('/storage/', '', $moviePath)
          )
      );
  }

  // バリデーション異常（タイトル未入力）
  public function test_title_is_required_when_uploading_a_movie(): void
  {
      Storage::fake('public');

      $user = User::factory()->create();

      $movieFile = UploadedFile::fake()->create(
          'sample.mp4',
          1024,
          'video/mp4'
      );

      $thumbnailFile = UploadedFile::fake()->image('thumbnail.jpg');

      $response = $this
          ->actingAs($user)
          ->postJson('/api/movies', [
              'movie' => $movieFile,
              'thumbnail' => $thumbnailFile,
          ]);

      $response
          ->assertUnprocessable()
          ->assertJsonValidationErrors('title');

      $this->assertDatabaseCount('movies', 0);
  }

  // バリデーション異常（動画ファイル形式違い）
  public function test_movie_must_be_a_video_file(): void
  {
      Storage::fake('public');

      $user = User::factory()->create();

      $invalidMovieFile = UploadedFile::fake()->create(
          'document.pdf',
          1024,
          'application/pdf'
      );

      $thumbnailFile = UploadedFile::fake()->image('thumbnail.jpg');

      $response = $this
          ->actingAs($user)
          ->postJson('/api/movies', [
              'title' => 'テスト動画',
              'movie' => $invalidMovieFile,
              'thumbnail' => $thumbnailFile,
          ]);

      $response
          ->assertUnprocessable()
          ->assertJsonValidationErrors('movie');

      $this->assertDatabaseCount('movies', 0);
  }

  // 動画更新
  public function test_owner_can_update_own_movie(): void
  {
      $owner = User::factory()->create();

      $movie = Movie::factory()->create([
          'user_id' => $owner->id,
          'title' => '元のタイトル',
          'description' => '元の説明',
      ]);

      $response = $this
          ->actingAs($owner)
          ->patchJson("/api/movies/{$movie->id}", [
              'title' => '変更後のタイトル',
              'description' => '変更後の説明',
          ]);

      $response->assertOk();

      $this->assertDatabaseHas('movies', [
          'id' => $movie->id,
          'user_id' => $owner->id,
          'title' => '変更後のタイトル',
          'description' => '変更後の説明',
      ]);
  }

  // 動画削除
  public function test_owner_can_delete_own_movie(): void
  {
      $owner = User::factory()->create();

      $movie = Movie::factory()->create([
          'user_id' => $owner->id,
      ]);

      $response = $this
          ->actingAs($owner)
          ->deleteJson("/api/movies/{$movie->id}");

      $response
        ->assertOK()
        ->assertJson([
          'message' => '動画を削除しました',
        ]);

      $this->assertDatabaseMissing('movies', [
          'id' => $movie->id,
      ]);
  }

  // 第三者による動画更新
  public function test_user_cannot_update_another_users_movie(): void
  {
      $owner = User::factory()->create();
      $otherUser = User::factory()->create();

      $movie = Movie::factory()->create([
          'user_id' => $owner->id,
          'title' => '元のタイトル',
      ]);

      $response = $this
          ->actingAs($otherUser)
          ->patchJson("/api/movies/{$movie->id}", [
              'title' => '勝手に変更したタイトル',
          ]);

      $response->assertForbidden();

      $this->assertDatabaseHas('movies', [
          'id' => $movie->id,
          'user_id' => $owner->id,
          'title' => '元のタイトル',
      ]);
  }

  // 第三者による動画削除
  public function test_user_cannot_delete_another_users_movie(): void
  {
      $owner = User::factory()->create();
      $otherUser = User::factory()->create();

      $movie = Movie::factory()->create([
          'user_id' => $owner->id,
          'title' => '元のタイトル',
      ]);

      $response = $this
          ->actingAs($otherUser)
          ->deleteJson("/api/movies/{$movie->id}");

      $response->assertForbidden();

      $this->assertDatabaseHas('movies', [
          'id' => $movie->id,
          'user_id' => $owner->id,
          'title' => '元のタイトル',
      ]);
  }

  // 管理者による第三者の動画削除
  public function test_admin_can_delete_another_users_movie(): void
  {
      $admin = User::factory()->create([
          'is_admin' => true,
      ]);

      $owner = User::factory()->create();

      $movie = Movie::factory()->create([
          'user_id' => $owner->id,
      ]);

      $response = $this
          ->actingAs($admin)
          ->deleteJson("/api/movies/{$movie->id}");

      $response
          ->assertOk()
          ->assertJson([
              'message' => '動画を削除しました',
          ]);

      $this->assertDatabaseMissing('movies', [
          'id' => $movie->id,
      ]);
  }
}