<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;

class AdminSeeder extends Seeder
{
    public function run()
    {
        Admin::create([
            'username' => 'Super Admin',
            'email' => 'admin@example.com',
            'motdepasse' => bcrypt('admin1234') // hashed password
        ]);
    }
}

