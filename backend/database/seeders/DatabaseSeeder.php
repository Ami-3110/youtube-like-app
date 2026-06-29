<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // User::factory(10)->create();

        User::updateOrCreate(
          ['email' => 'test@example.com'],
          [
            'name' => 'Tester1',
            'password' => bcrypt('password'),
            'handle' => 'tester1',
            'avatar_path' => '/avatars/tester1.png',
            'is_admin' => true,
          ],
        );
        User::updateOrCreate(
          ['email' => 'hoge@example.com'],
          [
            'name' => 'Tester2',
            'password' => bcrypt('password'),
            'handle' => 'tester2',
          ],
        );
        User::updateOrCreate(
          ['email' => 'fuga@example.com'],
          [
            'name' => 'Tester3',
            'password' => bcrypt('password'),
            'handle' => 'tester3',
          ],
        );
        User::updateOrCreate(
          ['email' => 'piyo@example.com'],
          [
            'name' => 'Tester4',
            'password' => bcrypt('password'),
            'handle' => 'tester4',
          ],
        );

        $this->call([
            TopicSeeder::class,
            MovieSeeder::class,
            MovieTopicSeeder::class,
            CommentSeeder::class,
        ]);

    }
}
