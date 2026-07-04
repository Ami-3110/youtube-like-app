<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Ami',
                'handle' => 'adminAmi',
                'email' => 'admin@sample.com',
                'password' => Hash::make('password'),
                'avatar_path' => '/avatars/admin.png',
                'bio' => '開発者のチャンネルです。
                SeaTubeへようこそ！このアプリはLaravel・Next.jsを用いて個人開発したYouTube風動画共有サービスです。Google OAuthや動画アップロード、チャンネル登録など、実際のWebサービスを意識して実装しました。',
            ],
            [
                'name' => 'デモ美',
                'handle' => 'handle1',
                'email' => 'demouser1@sample.com',
                'password' => Hash::make('password'),
                'avatar_path' => '/avatars/demo1.png',
                'bio' => '開発者によるデモユーザーです。',
            ],
            [
                'name' => 'デモ也',
                'handle' => 'handle2',
                'email' => 'demouser2@sample.com',
                'password' => Hash::make('password'),
                'avatar_path' => '/avatars/demo2.png',
                'bio' => '開発者によるデモユーザーです。',
            ],
            [
                'name' => 'デモ太',
                'handle' => 'handle3',
                'email' => 'demouser3@sample.com',
                'password' => Hash::make('password'),
                'avatar_path' => '/avatars/demo3.png',
                'bio' => '開発者によるデモユーザーです。',
            ],
            [
                'name' => 'デモ子',
                'handle' => 'handle4',
                'email' => 'demouser4@sample.com',
                'password' => Hash::make('password'),
                'avatar_path' => '/avatars/demo4.png',
                'bio' => '開発者によるデモユーザーです。',
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}