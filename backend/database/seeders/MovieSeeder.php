<?php

namespace Database\Seeders;

use App\Models\Movie;
use Illuminate\Database\Seeder;

class MovieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $movies = [
            [
              'user_id' => 1,
              'title' => 'ハワイのマンタ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/hawaii_mantaray.mp4',
              'thumbnail_path' => '/thumbnails/hawaii_mantaray.jpg',
            ],
            [
              'user_id' => 2,
              'title' => 'オスロブのジンベイザメ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/oslob_whaleshark.mp4',
              'thumbnail_path' => '/thumbnails/oslob_whaleshark.jpg',
            ],
            [
              'user_id' => 3,
              'title' => 'モアルボアルのサーディンラン',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/moalboal_sardinerun.mp4',
              'thumbnail_path' => '/thumbnails/moalboal_sardinerun.jpg',
            ],
            [
              'user_id' => 1,
              'title' => 'ブスアンガのジュゴン',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/busuanga_dugong.mp4',
              'thumbnail_path' => '/thumbnails/busuanga_dugong.jpg',
            ],
            [
              'user_id' => 4,
              'title' => 'ブスアンガのギンガメトルネード',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/busuanga_jacks_tornado.mp4',
              'thumbnail_path' => '/thumbnails/busuanga_jacks_tornado.jpg',
            ],
            [
              'user_id' => 5,
              'title' => '御蔵島のミナミハンドウイルカ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/mikura_dolphins.mp4',
              'thumbnail_path' => '/thumbnails/mikura_dolphins.jpg',
            ],
            [
              'user_id' => 1,
              'title' => 'マラパスクアのニタリ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/malapasucua_threshershark.mp4',
              'thumbnail_path' => '/thumbnails/malapasucua_threshershark.jpg',
            ],
            [
              'user_id' => 2,
              'title' => 'ヌサペニダのマンタ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/nusapenida_mantaray.mp4','thumbnail_path' => '/thumbnails/nusapenida_mantaray.jpg',
            ],
            [
              'user_id' => 3,
              'title' => '神子元島のハンマーヘッドシャーク',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/mikomoto_hammerhead.mp4',
              'thumbnail_path' => '/thumbnails/mikomoto_hammerhead.jpg',
            ],
            [
              'user_id' => 4,
              'title' => '小笠原のミナミハンドウイルカ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/ogasawara_dolphins.mp4',
              'thumbnail_path' => '/thumbnails/ogasawara_dolphins.jpg',
            ],
            [
              'user_id' => 5,
              'title' => '小笠原のホワイトチップ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/ogasaawra_whitechip.mp4',
              'thumbnail_path' => '/thumbnails/ogasaawra_whitechip.jpg',
            ],
            [
              'user_id' => 1,
              'title' => 'ダウィンのミミックオクトパス',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/dauin_mimicoctopus.mp4',
              'thumbnail_path' => '/thumbnails/dauin_mimicoctopus.jpg',
            ],
            [
              'user_id' => 2,
              'title' => '熱海のコガネアジ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/atami_sardinerun.mp4',
              'thumbnail_path' => '/thumbnails/atami_sardinerun.jpg',
            ],
            [
              'user_id' => 3,
              'title' => 'マクタンのツバメウオの群れ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/mactan_batfish.mp4','thumbnail_path' => '/thumbnails/mactan_batfish.jpg',
            ],
            [
              'user_id' => 4,
              'title' => 'ヒルトゥガンのジャイアントトレバリーの群れ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/hilutangan_GT.mp4',
              'thumbnail_path' => '/thumbnails/hilutangan_GT.jpg',
            ],
            [
              'user_id' => 5,
              'title' => 'マクタンのサーディンラン',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/mactan_sardinerun.mp4',
              'thumbnail_path' => '/thumbnails/mactan_sardinerun.jpg',
            ],
            [
              'user_id' => 1,
              'title' => 'マラパスクアのウミガメ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/malapasucua_seaturtle.mp4',
              'thumbnail_path' => '/thumbnails/malapasucua_seaturtle.jpg',
            ],
            [
              'user_id' => 1,
              'title' => '稚内のトド',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/wakkanai_sealions.mp4',
              'thumbnail_path' => '/thumbnails/wakkanai_sealions.jpg',
            ],
            [
              'user_id' => 3,
              'title' => '城ヶ崎のダンゴウオ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/jogashima_lumpfish.mp4',
              'thumbnail_path' => '/thumbnails/jogashima_lumpfish.jpg',
            ],
            [
              'user_id' => 4,
              'title' => 'マラパスクアのモンガラカワハギ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/malapasucua_triggerfish.mp4',
              'thumbnail_path' => '/thumbnails/malapasucua_triggerfish.jpg',
            ],
            [
              'user_id' => 5,
              'title' => 'マラパスクアのイソギンチャクモエビ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/malapasucua_squatanemoneshrimp.mp4',
              'thumbnail_path' => '/thumbnails/malapasucua_squatanemoneshrimp.jpg',
            ],
            [
              'user_id' => 1,
              'title' => 'マクタンのオランウータンクラブ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/mactun_orangutancrab.mp4',
              'thumbnail_path' => '/thumbnails/mactun_orangutancrab.jpg',
            ],
            [
              'user_id' => 2,
              'title' => 'ダウィンのハナイカ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/dauin_flamboyantcuttlefish.mp4',
              'thumbnail_path' => '/thumbnails/dauin_flamboyantcuttlefish.jpg',
            ],
            [
              'user_id' => 3,
              'title' => 'ダウィンのアンナウミウシ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/dauin_annanudibranch.mp4',
              'thumbnail_path' => '/thumbnails/dauin_annanudibranch.jpg',
            ],
            [
              'user_id' => 4,
              'title' => 'ダウィンのココナッツオクトパス',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/dauin_coconutoctopus.mp4',
              'thumbnail_path' => '/thumbnails/dauin_coconutoctopus.jpg',
            ],
            [
              'user_id' => 5,
              'title' => 'ダウィンのクロスジリュウグウウミウシ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/dauin_blacknudibranch.mp4',
              'thumbnail_path' => '/thumbnails/dauin_blacknudibranch.jpg',
            ],
            [
              'user_id' => 1,
              'title' => 'ダウィンの白いウミウシ',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/dauin_whitenudibranch.mp4',
              'thumbnail_path' => '/thumbnails/dauin_whitenudibranch.jpg',
            ],
            [
              'user_id' => 2,
              'title' => 'ダウィンのピンクスクワッドロブスター',
              'description' => '開発者によるデモ動画です。',
              'movie_path' => '/movies/dauin_pinksquadlobster.mp4',
              'thumbnail_path' => '/thumbnails/dauin_pinksquadlobster.jpg',
            ],
        ];

        foreach ($movies as $movie) {
          Movie::firstOrCreate(
          [
            'title' => $movie['title'],
          ],
          [
            'user_id' => $movie['user_id'],
            'description' => $movie['description'],
            'movie_path' => $movie['movie_path'],
            'thumbnail_path' => $movie['thumbnail_path'],
          ]);
        }
    }
}
