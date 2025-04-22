<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom', 'description', 'prix', 'id_entreprise', 'id_type_produit'
    ];

    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class, 'id_entreprise');
    }

    public function typeProduct()
    {
        return $this->belongsTo(TypeProduct::class, 'id_type_produit');
    }
}