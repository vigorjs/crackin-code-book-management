<?php

namespace Database\Seeders;

use App\Models\Publisher;
use Illuminate\Database\Seeder;

class PublisherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $publishers = [
            'Gramedia',
            'Grasindo',
            'Bukunesia',
            'Erlangga',
            'Nasmedia',
            'Rajawali'
        ];

        foreach ($publishers as $publisher) {
            Publisher::create([
                'name' => $publisher
            ]);
        }
    }
}
