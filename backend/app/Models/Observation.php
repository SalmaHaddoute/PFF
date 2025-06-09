<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Observation extends Model
{
       use HasFactory;
    protected $fillable = [
        'reclamation_id',
        'rc',
        'ice',
        'nom_entreprise_post',
        'nom_entreprise_fraud',
        'reclamation'
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
