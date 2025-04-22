<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('blacklists', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('id_entreprise');
        $table->string('nom_entreprise_post');
        $table->string('nom_entreprise_fraud');
        $table->text('raison');
        $table->string('preuve_file')->nullable();
        $table->dateTime('post_date');
        $table->timestamps();
        
        // Clé étrangère si nécessaire
        $table->foreign('id_entreprise')->references('id')->on('entreprises');
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blacklists');
    }
};
