<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('entreprises', function (Blueprint $table) {
            $table->id();
            $table->string('ice')->unique();
            $table->string('rc')->unique();
            $table->string('username')->unique();
            $table->string('address');
            $table->string('email')->unique();
            $table->string('motdepasse');
            $table->date('date_creation');
            $table->foreignId('id_secteur')->nullable()->constrained('secteurs')->onDelete('cascade');
            $table->string('status')->default('pending');
            $table->boolean('admin')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entreprises');
    }
};
