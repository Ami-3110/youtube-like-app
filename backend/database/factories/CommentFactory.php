<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Movie;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Comment>
 */
class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition(): array
    {
        return [
            'movie_id' => Movie::factory(),
            'user_id' => User::factory(),
            'parent_id' => null,
            'body' => fake()->sentence(),
        ];
    }
}
