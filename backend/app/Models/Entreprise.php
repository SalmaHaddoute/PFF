<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // On hérite de Authenticatable
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class Entreprise extends Authenticatable // Héritage de Authenticatable
{
    use HasFactory, Notifiable;


    const STATUS_ACCEPTED = 'accepté';
    const STATUS_PENDING = 'en attente';
    const STATUS_REJECTED = 'refusé';

    protected $table = 'entreprises'; // Nom de la table

    
    // Spécifiez que 'motdepasse' est la colonne password
    public function getAuthPassword()
{
    return $this->motdepasse; // Crucial
}
    protected $guard = 'entreprise';

    protected $casts = [
        'date_creation' => 'datetime'
    ];
    // Ajoutez cette méthode pour Sanctum
    public function createToken($name, array $abilities = ['*'])
    {
        return $this->tokens()->create([
            'name' => $name,
            'token' => hash('sha256', $plainTextToken = Str::random(40)),
            'abilities' => $abilities,
        ]);
    }
    // Dans app/Models/Entreprise.php
    protected $fillable = [
        'username',
        'email',
        'motdepasse',
        'rc',
        'ice',
        'id_secteur',
        'address',
        'status',
        'date_creation' // Ajoutez ce champ
    ];

protected $dates = [
    'date_creation'
];
public function setMotdepasseAttribute($value)
{
    if (!empty($value)) {
        $this->attributes['motdepasse'] = Hash::make($value);
    } else {
        $this->attributes['motdepasse'] = null;
    }
}


    protected $hidden = [
        'motdepasse',
        'remember_token',
    ];
    

    
    // Relations                  
    public function secteur()
    {
        return $this->belongsTo(Secteur::class, 'id_secteur');
    }                                     

    public function techniciens()
    {
        return $this->hasMany(Technicien::class, 'id_entreprise');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'id_entreprise');
    }

    public function publications()
    {
        return $this->hasMany(Publication::class, 'id_entreprise');
    }

    public function observations()
    {
        return $this->hasMany(Observation::class, 'id_entreprise');
    }
    
}
