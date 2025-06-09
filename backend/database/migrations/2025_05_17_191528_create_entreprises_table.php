<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
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
            $table->foreignId('id_secteur')->constrained('secteurs')->onDelete('cascade');
            $table->enum('status', ['accepté', 'en attente', 'refusé'])->default('en attente');
            $table->boolean('admin')->default(false);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('entreprises');
    }
};
