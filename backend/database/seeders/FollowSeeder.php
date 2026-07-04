<?php

namespace Database\Seeders;

use App\Models\Follow;
use Illuminate\Database\Seeder;

class FollowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $follows = [
            // Ami
            ['follower_id' => 1, 'following_id' => 2],
            ['follower_id' => 1, 'following_id' => 3],
            ['follower_id' => 1, 'following_id' => 4],
            ['follower_id' => 1, 'following_id' => 5],

            // デモ美
            ['follower_id' => 2, 'following_id' => 1],
            ['follower_id' => 2, 'following_id' => 3],

            // デモ也
            ['follower_id' => 3, 'following_id' => 1],
            ['follower_id' => 3, 'following_id' => 5],

            // デモ太
            ['follower_id' => 4, 'following_id' => 1],
            ['follower_id' => 4, 'following_id' => 2],

            // デモ子
            ['follower_id' => 5, 'following_id' => 1],
            ['follower_id' => 5, 'following_id' => 2],
            ['follower_id' => 5, 'following_id' => 4],
        ];

        foreach ($follows as $follow) {
            Follow::firstOrCreate($follow);
        }
    }
}