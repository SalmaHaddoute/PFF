<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_entreprise',
        'nom_entreprise_post',
        'nom_entreprise_fraud',
        'raison',
        'preuve_file',
        'status',
        'date_publication'
    ];

    protected $dates = [
        'date_publication'
    ];
}