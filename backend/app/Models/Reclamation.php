<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reclamation extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_entreprise',
        'rc',
        'ice',
        'nom_entreprise_post',
        'nom_entreprise_fraud',
        'raison',
        'preuve_file',
        'status',
        'post_date'
    ];

    protected $dates = [
        'post_date'
    ];
    protected static function booted()
    {
        static::updated(function ($reclamation) {
            if ($reclamation->status === 'accepter' && $reclamation->getOriginal('status') !== 'accepter') {
                Blacklist::create([
                    'nom_entreprise_post' => $reclamation->nom_entreprise_post,
                    'nom_entreprise_fraud' => $reclamation->nom_entreprise_fraud,
                    'raison' => $reclamation->raison,
                    'preuve_file' => $reclamation->preuve_file,
                    'post_date' => $reclamation->date_publication,
                ]);
            }
        });
    }
}
