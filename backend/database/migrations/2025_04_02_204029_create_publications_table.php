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
        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_entreprise')->constrained('entreprises');
            $table->string('rc');
            $table->string('ice');
            $table->string('nom_entreprise_post');
            $table->string('nom_entreprise_fraud');
            $table->text('raison');
            $table->string('preuve_file');
            $table->string('status')->default('pending');
            $table->dateTime('date_publication');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publications');
    }
};
