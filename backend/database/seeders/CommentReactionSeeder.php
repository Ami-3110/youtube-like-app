<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\CommentReaction;
use Illuminate\Database\Seeder;

class CommentReactionSeeder extends Seeder
{
    public function run(): void
    {
        $reactions = [
            'マンタの迫力がすごいですね！いつか見てみたいです。' => [1, 3, 4, 5],
            'ありがとうございます！ナイトで見るマンタは本当に感動します。' => [2, 3],
            '光に集まってくる感じが幻想的ですね。' => [1, 2],
            'ジンベイザメの近さにびっくりしました！' => [2, 3, 4],
            '魚群の密度がすごい！ずっと見ていられます。' => [1, 2, 3, 5],
            'ビーチから見られるのがいいですね。' => [1, 4],
            '神子元らしい迫力のある映像ですね。' => [3, 4, 5],
            'ドリフト感があってかっこいいです！' => [1, 3],
            '色がきれいでかわいいですね。' => [1, 4, 5],
            'マクロ好きにはたまらない動画ですね。' => [1, 3, 4],
            '国内でトドが見られるのはすごいですね。' => [2, 4, 5],
        ];

        foreach ($reactions as $commentBody => $userIds) {
            $comment = Comment::where('body', $commentBody)->first();

            if (! $comment) {
                continue;
            }

            foreach ($userIds as $userId) {
                if ($comment->user_id === $userId) {
                    continue;
                }

                CommentReaction::firstOrCreate(
                    [
                        'comment_id' => $comment->id,
                        'user_id' => $userId,
                    ],
                    [
                        'type' => 'like',
                    ]
                );
            }
        }
    }
}