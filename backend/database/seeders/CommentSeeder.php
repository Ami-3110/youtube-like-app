<?php

namespace Database\Seeders;

use App\Models\Movie;
use App\Models\Comment;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $comments = [
          [
            'movie_title' => 'ハワイのマンタ',
            'body' => 'ナイトダイブのマンタ最高！',
          ],
          [
            'movie_title' => 'ハワイのマンタ',
            'body' => 'ライトに集まってくるの神秘的ですね。',
          ],
          [
            'movie_title' => 'オスロブのジンベイザメ',
            'body' => '近すぎて迫力ありますね！',
          ],
          [
            'movie_title' => 'モアルボアルのサーディンラン',
            'body' => '群れの密度がすごい。',
          ],
        ];

        foreach ($comments as $commentData) {
          $movie = Movie::where('title', $commentData['movie_title'])->first();
          
          Comment::create([
            'movie_id' => $movie->id,
            'user_id' => 1,
            'body' => $commentData['body'],
          ]);
        }
    }
}
