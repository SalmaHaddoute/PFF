<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;
class Admin extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'username', 'email', 'motdepasse'
    ];

    protected $hidden = [
        'motdepasse', 'remember_token',
    ];
// In Admin.php and Entreprise.php
public function getAuthPassword() {
    return $this->motdepasse; // Must match the database column
}

}
