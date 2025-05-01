<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Observation extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'observations';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'reclamation_id',
        'reclamation',
        'nom_entreprise_post',
        'nom_entreprise_fraud',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * Get the reclamation that this observation belongs to.
     */
    public function reclamation()
    {
        return $this->belongsTo(Reclamation::class, 'reclamation_id', 'id');
    }
}
