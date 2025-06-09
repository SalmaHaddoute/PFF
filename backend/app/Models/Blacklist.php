<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blacklist extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_entreprise',
        'nom_entreprise_post',
        'nom_entreprise_fraud',
        'raison',
        'preuve_file',
        'post_date'
    ];
    
    // Relation si nécessaire
    public function entreprise()
    {
        return $this->belongsTo(\App\Models\Entreprise::class, 'id_entreprise');
    }
}
