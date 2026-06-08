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
              'title' => 'ハワイのマンタ',
              'movie_path' => '/movies/hawaii_mantaray.mp4',
              'thumbnail_path' => '/thumbnails/hawaii_mantaray.jpg',
            ],
            [
              'title' => 'オスロブのジンベイザメ',
              'movie_path' => '/movies/oslob_whaleshark.mp4',
              'thumbnail_path' => '/thumbnails/oslob_whaleshark.jpg',
            ],
            [
              'title' => 'モアルボアルのサーディンラン',
              'movie_path' => '/movies/moalboal_sardinerun.mp4',
              'thumbnail_path' => '/thumbnails/moalboal_sardinerun.jpg',
            ],
            [
              'title' => 'ブスアンガのジュゴン',
              'movie_path' => '/movies/busuanga_dugong.mp4',
              'thumbnail_path' => '/thumbnails/busuanga_dugong.jpg',
            ],
            [
              'title' => 'ブスアンガのギンガメトルネード',
              'movie_path' => '/movies/busuanga_jacks_tornado.mp4',
              'thumbnail_path' => '/thumbnails/busuanga_jacks_tornado.jpg',
            ],
            [
              'title' => '御蔵のミナミハンドウイルカ',
              'movie_path' => '/movies/mikura_dolphins.mp4',
              'thumbnail_path' => '/thumbnails/mikura_dolphins.jpg',
            ],
            [
              'title' => 'マラパスクアのニタリ',
              'movie_path' => '/movies/malapasucua_threshershark.mp4',
              'thumbnail_path' => '/thumbnails/malapasucua_threshershark.jpg',
            ],
            [
              'title' => 'ヌサペニダのマンタ',
              'movie_path' => '/movies/nusapenida_mantaray.mp4','thumbnail_path' => '/thumbnails/nusapenida_mantaray.jpg',
            ],
            [
              'title' => '神子元島のハンマーヘッドシャーク',
              'movie_path' => '/movies/mikomoto_hammerhead.mp4',
              'thumbnail_path' => '/thumbnails/mikomoto_hammerhead.jpg',
            ],
            [
              'title' => '小笠原のミナミハンドウイルカ',
              'movie_path' => '/movies/ogasawara_dolphins.mp4',
              'thumbnail_path' => '/thumbnails/ogasawara_dolphins.jpg',
            ],
            [
              'title' => '小笠原のホワイトチップ',
              'movie_path' => '/movies/ogasaawra_whitechip.mp4',
              'thumbnail_path' => '/thumbnails/ogasaawra_whitechip.jpg',
            ],
            [
              'title' => 'ダウィンのミミックオクトパス',
              'movie_path' => '/movies/dauin_mimicoctopus.mp4',
              'thumbnail_path' => '/thumbnails/dauin_mimicoctopus.jpg',
            ],
            [
              'title' => '熱海のコガネアジ',
              'movie_path' => '/movies/atami_sardinerun.mp4',
              'thumbnail_path' => '/thumbnails/atami_sardinerun.jpg',
            ],
            [
              'title' => 'マクタンのツバメウオの群れ',
              'movie_path' => '/movies/mactan_batfish.mp4','thumbnail_path' => '/thumbnails/mactan_batfish.jpg',
            ],
            [
              'title' => 'ヒルトゥガンのジャイアントトレバリーの群れ',
              'movie_path' => '/movies/hilutangan_GT.mp4',
              'thumbnail_path' => '/thumbnails/hilutangan_GT.jpg',
            ],
            [
              'title' => 'マクタンのサーディンラン',
              'movie_path' => '/movies/mactan_sardinerun.mp4',
              'thumbnail_path' => '/thumbnails/mactan_sardinerun.jpg',
            ],
            [
              'title' => 'マラパスクアのウミガメ',
              'movie_path' => '/movies/malapasucua_seaturtle.mp4',
              'thumbnail_path' => '/thumbnails/malapasucua_seaturtle.jpg',
            ],
            [
              'title' => '稚内のトド',
              'movie_path' => '/movies/wakkanai_sealions.mp4',
              'thumbnail_path' => '/thumbnails/wakkanai_sealions.jpg',
            ],
            [
              'title' => '城ヶ崎のダンゴウオ',
              'movie_path' => '/movies/jogashima_lumpfish.mp4',
              'thumbnail_path' => '/thumbnails/jogashima_lumpfish.jpg',
            ],
            [
              'title' => 'マラパスクアのモンガラカワハギ',
              'movie_path' => '/movies/malapasucua_triggerfish.mp4',
              'thumbnail_path' => '/thumbnails/malapasucua_triggerfish.jpg',
            ],
            [
              'title' => 'マラパスクアのイソギンチャクモエビ',
              'movie_path' => '/movies/malapasucua_squatanemoneshrimp.mp4',
              'thumbnail_path' => '/thumbnails/malapasucua_squatanemoneshrimp.jpg',
            ],
            [
              'title' => 'マクタンのオランウータンクラブ',
              'movie_path' => '/movies/mactun_orangutancrab.mp4',
              'thumbnail_path' => '/thumbnails/mactun_orangutancrab.jpg',
            ],
            [
              'title' => 'ダウィンのハナイカ',
              'movie_path' => '/movies/dauin_flamboyantcuttlefish.mp4',
              'thumbnail_path' => '/thumbnails/dauin_flamboyantcuttlefish.jpg',
            ],
            [
              'title' => 'ダウィンのアンナウミウシ',
              'movie_path' => '/movies/dauin_annanudibranch.mp4',
              'thumbnail_path' => '/thumbnails/dauin_annanudibranch.jpg',
            ],
            [
              'title' => 'ダウィンのココナッツオクトパス',
              'movie_path' => '/movies/dauin_coconutoctopus.mp4',
              'thumbnail_path' => '/thumbnails/dauin_coconutoctopus.jpg',
            ],
            [
              'title' => 'ダウィンのクロスジリュウグウウミウシ',
              'movie_path' => '/movies/dauin_blacknudibranch.mp4',
              'thumbnail_path' => '/thumbnails/dauin_blacknudibranch.jpg',
            ],
            [
              'title' => 'ダウィンの白いウミウシ',
              'movie_path' => '/movies/dauin_whitenudibranch.mp4',
              'thumbnail_path' => '/thumbnails/dauin_whitenudibranch.jpg',
            ],
            [
              'title' => 'ダウィンのピンクスクワッドロブスター',
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
            'user_id' => 1,
            'movie_path' => $movie['movie_path'],
            'thumbnail_path' => $movie['thumbnail_path'],
          ]);
        }
    }
}
