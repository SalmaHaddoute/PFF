<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'email',
        'motdepasse', // Assure-toi que ce champ est bien autorisé
    ];

    protected $hidden = [
        'motdepasse', // Cacher le champ dans les réponses
        'remember_token',
    ];

    // 🔹 DIT À LARAVEL D’UTILISER `motdepasse` À LA PLACE DE `password`
    public function getAuthPassword()
    {
        return $this->motdepasse;
    }
}
