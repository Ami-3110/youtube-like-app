<?php

namespace Tests\Feature;

use App\Models\Topic;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TopicTest extends TestCase
{
    use RefreshDatabase;

    // トピック一覧を名前順で取得できる
    public function test_topics_can_be_get_in_name_order(): void
    {
        Topic::create([
            'name' => 'サメ',
        ]);

        Topic::create([
            'name' => '沈船',
        ]);

        Topic::create([
            'name' => 'ウミウシ',
        ]);

        $response = $this->getJson('/api/topics');

        $response
            ->assertOk()
            ->assertJsonCount(3)
            ->assertJsonPath('0.name', 'ウミウシ')
            ->assertJsonPath('1.name', 'サメ')
            ->assertJsonPath('2.name', '沈船');
    }

    // トピック一覧にはidとnameだけが含まれる
    public function test_topics_response_contains_only_id_and_name(): void
    {
        $topic = Topic::create([
            'name' => 'ダイビング',
        ]);

        $response = $this->getJson('/api/topics');

        $response
            ->assertOk()
            ->assertExactJson([
                [
                    'id' => $topic->id,
                    'name' => 'ダイビング',
                ],
            ]);
    }

    // トピックが存在しない場合は空の配列を取得できる
    public function test_topics_returns_empty_array_when_no_topics_exist(): void
    {
        $response = $this->getJson('/api/topics');

        $response
            ->assertOk()
            ->assertExactJson([]);
    }
}
