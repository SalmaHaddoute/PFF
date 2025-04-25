<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    protected $table = 'admins';
    protected $fillable = ['username', 'email', 'motdepasse'];
    
    // Spécifiez que 'motdepasse' est la colonne password
    public function getAuthPassword()
    {
        return $this->motdepasse;
    }
}