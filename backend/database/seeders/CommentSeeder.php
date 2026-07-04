<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Movie;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $comments = [
            'ハワイのマンタ' => [
                [
                    'user_id' => 2,
                    'body' => 'マンタの迫力がすごいですね！いつか見てみたいです。',
                    'replies' => [
                        [
                            'user_id' => 1,
                            'body' => 'ありがとうございます！ナイトで見るマンタは本当に感動します。',
                        ],
                    ],
                ],
                [
                    'user_id' => 3,
                    'body' => '光に集まってくる感じが幻想的ですね。',
                    'replies' => [],
                ],
            ],
            'オスロブのジンベイザメ' => [
                [
                    'user_id' => 1,
                    'body' => 'ジンベイザメの近さにびっくりしました！',
                    'replies' => [
                        [
                            'user_id' => 2,
                            'body' => 'かなり近くで見られるので迫力があります。',
                        ],
                    ],
                ],
            ],
            'モアルボアルのサーディンラン' => [
                [
                    'user_id' => 4,
                    'body' => '魚群の密度がすごい！ずっと見ていられます。',
                    'replies' => [],
                ],
                [
                    'user_id' => 5,
                    'body' => 'ビーチから見られるのがいいですね。',
                    'replies' => [
                        [
                            'user_id' => 3,
                            'body' => 'アクセスしやすいのに迫力があるのが魅力です。',
                        ],
                    ],
                ],
            ],
            '神子元島のハンマーヘッドシャーク' => [
                [
                    'user_id' => 1,
                    'body' => '神子元らしい迫力のある映像ですね。',
                    'replies' => [],
                ],
                [
                    'user_id' => 5,
                    'body' => 'ドリフト感があってかっこいいです！',
                    'replies' => [],
                ],
            ],
            'ダウィンのハナイカ' => [
                [
                    'user_id' => 3,
                    'body' => '色がきれいでかわいいですね。',
                    'replies' => [
                        [
                            'user_id' => 2,
                            'body' => '動きも独特で、見つけるとうれしい生き物です。',
                        ],
                    ],
                ],
            ],
            'ダウィンの白いウミウシ' => [
                [
                    'user_id' => 2,
                    'body' => 'マクロ好きにはたまらない動画ですね。',
                    'replies' => [],
                ],
                [
                    'user_id' => 4,
                    'body' => '小さい生き物もきれいに撮れていますね。',
                    'replies' => [],
                ],
            ],
            '稚内のトド' => [
                [
                    'user_id' => 1,
                    'body' => '国内でトドが見られるのはすごいですね。',
                    'replies' => [
                        [
                            'user_id' => 4,
                            'body' => '寒いですが、迫力はかなりあります！',
                        ],
                    ],
                ],
            ],
        ];

        foreach ($comments as $movieTitle => $items) {
            $movie = Movie::where('title', $movieTitle)->first();

            if (! $movie) {
                continue;
            }

            foreach ($items as $item) {
                $parent = Comment::firstOrCreate(
                    [
                        'movie_id' => $movie->id,
                        'user_id' => $item['user_id'],
                        'parent_id' => null,
                        'body' => $item['body'],
                    ]
                );

                foreach ($item['replies'] as $reply) {
                    Comment::firstOrCreate(
                        [
                            'movie_id' => $movie->id,
                            'user_id' => $reply['user_id'],
                            'parent_id' => $parent->id,
                            'body' => $reply['body'],
                        ]
                    );
                }
            }
        }
    }
}