<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Technicien extends Model
{
    use HasFactory;

    protected $fillable = [
        'cin',
        'nom',
        'adresse',
        'email',
        'id_secteur',
        'id_entreprise',
        'telephone'
    ];

    public function secteur()
{
    return $this->belongsTo(Secteur::class, 'id_secteur');
}
}
