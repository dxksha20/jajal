<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed the demo accounts for Admin and Viewer roles.
     */
    public function run(): void
    {
        // 1. Admin Demo Account (Full CRUD & Status permissions)
        User::updateOrCreate(
            ['email' => 'admin@jajal.med'],
            [
                'name' => 'Dr. Eleanor Vance (Lead Admin)',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // 2. Viewer Demo Account (Read-only access)
        User::updateOrCreate(
            ['email' => 'viewer@jajal.med'],
            [
                'name' => 'Mark Reynolds (Clinical Viewer)',
                'password' => Hash::make('password'),
                'role' => 'viewer',
            ]
        );
    }
}
