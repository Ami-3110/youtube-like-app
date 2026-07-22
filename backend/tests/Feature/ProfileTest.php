<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    // ログインユーザーはプロフィールを更新できる
    public function test_authenticated_user_can_update_profile(): void
    {
        $user = User::factory()->create([
            'name' => '変更前',
            'handle' => 'old_handle',
            'bio' => '変更前の自己紹介',
        ]);

        $this->actingAs($user);

        $response = $this->patchJson('/api/me/profile', [
            'name' => 'Ami',
            'handle' => 'adminAmi',
            'bio' => '変更後の自己紹介',
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'id' => $user->id,
                'name' => 'Ami',
                'handle' => 'adminAmi',
                'bio' => '変更後の自己紹介',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Ami',
            'handle' => 'adminAmi',
            'bio' => '変更後の自己紹介',
        ]);
    }

    // 自分が現在使用しているhandleはそのまま使用できる
    public function test_user_can_keep_their_current_handle(): void
    {
        $user = User::factory()->create([
            'name' => 'Ami',
            'handle' => 'adminAmi',
        ]);

        $this->actingAs($user);

        $response = $this->patchJson('/api/me/profile', [
            'name' => 'Ami',
            'handle' => 'adminAmi',
            'bio' => null,
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'handle' => 'adminAmi',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'handle' => 'adminAmi',
        ]);
    }

    // 他のユーザーが使用しているhandleには変更できない
    public function test_handle_must_be_unique_except_for_current_user(): void
    {
        $user = User::factory()->create([
            'name' => 'Ami',
            'handle' => 'ami_handle',
        ]);

        User::factory()->create([
            'handle' => 'already_used',
        ]);

        $this->actingAs($user);

        $response = $this->patchJson('/api/me/profile', [
            'name' => 'Ami',
            'handle' => 'already_used',
            'bio' => null,
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('handle');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'handle' => 'ami_handle',
        ]);
    }

    // nameは必須
    public function test_name_is_required(): void
    {
        $user = User::factory()->create([
            'name' => 'Ami',
        ]);

        $this->actingAs($user);

        $response = $this->patchJson('/api/me/profile', [
            'name' => '',
            'handle' => 'adminAmi',
            'bio' => null,
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('name');
    }

    // ログインユーザーはアバター画像をアップロードできる
    public function test_authenticated_user_can_upload_avatar(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'name' => 'Ami',
            'avatar_path' => null,
        ]);

        $this->actingAs($user);

        $avatar = UploadedFile::fake()->image('avatar.jpg');

        $response = $this->patch(
            '/api/me/profile',
            [
                'name' => 'Ami',
                'handle' => 'adminAmi',
                'bio' => '自己紹介',
                'avatar' => $avatar,
            ],
            [
                'Accept' => 'application/json',
            ]
        );

        $response->assertOk();

        $storedPath = 'avatars/' . $avatar->hashName();

        $user->refresh();

        $this->assertSame(
            '/storage/' . $storedPath,
            $user->avatar_path
        );

        $this->assertTrue(
            Storage::disk('public')->exists($storedPath)
        );

        $response->assertJson([
            'id' => $user->id,
            'avatar_path' => '/storage/' . $storedPath,
        ]);
    }

    // 新しいアバターをアップロードすると古いアバターは削除される
    public function test_old_avatar_is_deleted_when_new_avatar_is_uploaded(): void
    {
        Storage::fake('public');

        Storage::disk('public')->put(
            'avatars/old-avatar.jpg',
            'old avatar'
        );

        $user = User::factory()->create([
            'name' => 'Ami',
            'avatar_path' => '/storage/avatars/old-avatar.jpg',
        ]);

        $this->actingAs($user);

        $newAvatar = UploadedFile::fake()->image('new-avatar.jpg');

        $response = $this->patch(
            '/api/me/profile',
            [
                'name' => 'Ami',
                'handle' => 'adminAmi',
                'bio' => '自己紹介',
                'avatar' => $newAvatar,
            ],
            [
                'Accept' => 'application/json',
            ]
        );

        $response->assertOk();

        $this->assertFalse(
            Storage::disk('public')->exists('avatars/old-avatar.jpg')
        );

        $this->assertTrue(
            Storage::disk('public')->exists(
                'avatars/' . $newAvatar->hashName()
            )
        );

        $user->refresh();

        $this->assertSame(
            '/storage/avatars/' . $newAvatar->hashName(),
            $user->avatar_path
        );
    }

    // 画像以外のファイルはアバターに設定できない
    public function test_avatar_must_be_an_image(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'name' => 'Ami',
        ]);

        $this->actingAs($user);

        $file = UploadedFile::fake()->create(
            'document.pdf',
            100,
            'application/pdf'
        );

        $response = $this->patch(
            '/api/me/profile',
            [
                'name' => 'Ami',
                'handle' => 'adminAmi',
                'bio' => null,
                'avatar' => $file,
            ],
            [
                'Accept' => 'application/json',
            ]
        );

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('avatar');

        $user->refresh();

        $this->assertNull($user->avatar_path);
    }

    // 5MBを超える画像はアップロードできない
    public function test_avatar_must_not_exceed_five_megabytes(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'name' => 'Ami',
        ]);

        $this->actingAs($user);

        $avatar = UploadedFile::fake()->image('large-avatar.jpg')
            ->size(5121);

        $response = $this->patch(
            '/api/me/profile',
            [
                'name' => 'Ami',
                'handle' => 'adminAmi',
                'bio' => null,
                'avatar' => $avatar,
            ],
            [
                'Accept' => 'application/json',
            ]
        );

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('avatar');

        $user->refresh();

        $this->assertNull($user->avatar_path);
    }

    // 未ログインユーザーはプロフィールを更新できない
    public function test_guest_cannot_update_profile(): void
    {
        $response = $this->patchJson('/api/me/profile', [
            'name' => 'Ami',
            'handle' => 'adminAmi',
            'bio' => '自己紹介',
        ]);

        $response->assertUnauthorized();
    }
}