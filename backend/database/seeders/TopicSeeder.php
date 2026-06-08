<?php

namespace Database\Seeders;

use App\Models\Topic;
use Illuminate\Database\Seeder;

class TopicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $topics = [
            'タコ',
            'イカ',
            'カメ',
            '哺乳類',
            '魚群',
            'サメ',
            'ウミウシ',
            '甲殻類',
            'マクロ',
            'ワイド',
            'ナイト',
            'ビーチ',
            'ボート',
            'ドリフト',
            '地形',
            'レック',
            'ケーブ',
        ];

        foreach ($topics as $topic) {
            Topic::firstOrCreate(['name' => $topic]);
        }
    }
}
