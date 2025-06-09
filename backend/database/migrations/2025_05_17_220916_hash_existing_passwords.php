<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up()
    {
        // Use DB facade instead of Eloquent to avoid model dependency
        $entreprises = DB::table('entreprises')->get();

        foreach ($entreprises as $entreprise) {
            if (!preg_match('/^\$2y\$/', $entreprise->password)) {
                DB::table('entreprises')
                    ->where('id', $entreprise->id)
                    ->update(['password' => Hash::make($entreprise->password)]);
            }
        }
    }

    public function down()
    {
        // This migration cannot be safely reversed
    }
};
