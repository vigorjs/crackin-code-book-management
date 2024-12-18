<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
            CategorySeeder::class,
            PublisherSeeder::class
        ]);

        $admin = \App\Models\User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password123'
        ]);
        $admin->assignRole('admin');

        $author = \App\Models\User::factory()->create([
            'name' => 'Author User',
            'email' => 'author@example.com',
            'password' => 'password123'
        ]);
        $author->assignRole('author');

        \App\Models\User::factory(10)->create()->each(function ($user) {
            $user->assignRole('author');
        });

    }
}
