<?php

namespace Database\Seeders;

use App\Models\Movie;
use App\Models\MovieReaction;
use Illuminate\Database\Seeder;

class MovieReactionSeeder extends Seeder
{
    public function run(): void
    {
        $reactions = [
            'ハワイのマンタ' => [
                [2, 'like'],
                [3, 'like'],
                [4, 'like'],
                [5, 'like'],
            ],
            'オスロブのジンベイザメ' => [
                [1, 'like'],
                [3, 'like'],
                [4, 'like'],
            ],
            'モアルボアルのサーディンラン' => [
                [1, 'like'],
                [2, 'like'],
                [4, 'like'],
                [5, 'like'],
            ],
            '神子元島のハンマーヘッドシャーク' => [
                [1, 'like'],
                [2, 'like'],
                [5, 'like'],
            ],
            'ダウィンのハナイカ' => [
                [1, 'like'],
                [3, 'like'],
                [4, 'like'],
            ],
            'ダウィンの白いウミウシ' => [
                [2, 'like'],
                [3, 'like'],
                [5, 'like'],
            ],
            '稚内のトド' => [
                [2, 'like'],
                [4, 'like'],
                [5, 'dislike'],
            ],
        ];

        foreach ($reactions as $movieTitle => $items) {
            $movie = Movie::where('title', $movieTitle)->first();

            if (! $movie) {
                continue;
            }

            foreach ($items as [$userId, $type]) {
                MovieReaction::firstOrCreate(
                    [
                        'movie_id' => $movie->id,
                        'user_id' => $userId,
                    ],
                    [
                        'type' => $type,
                    ]
                );
            }
        }
    }
}