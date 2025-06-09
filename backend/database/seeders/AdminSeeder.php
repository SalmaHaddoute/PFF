<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AdminSeeder extends Seeder
{
    public function run()
    {
        try {
            $admin = Admin::create([
                'username' => 'admin',
                'email' => 'admin@blacklist.com',
                'motdepasse' => Hash::make('admin123'), // Hash here instead
            ]);

            Log::info('Admin created:', $admin->toArray());
            $this->command->info('Admin user created successfully!');

        } catch (\Exception $e) {
            Log::error('Error creating admin: '.$e->getMessage());
            $this->command->error('Error creating admin: '.$e->getMessage());
        }
    }
}
