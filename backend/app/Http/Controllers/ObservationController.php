<?php

namespace App\Http\Controllers;

use App\Models\Reclamation;
use App\Models\Observation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;

class ObservationController extends Controller
{
    /**
     * Fetch reclamation details for observation form.
     * GET /api/admin/observations/reclamation/{id}
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function showReclamation($id)
    {
        try {
            $reclamation = Reclamation::select([
                'id',
                'rc',
                'ice',
                'nom_entreprise_post',
                'nom_entreprise_fraud',
                'raison',
                'preuve_file',
                'status',
                'created_at',
                'updated_at'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $reclamation
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error("Reclamation not found: ID {$id}", ['exception' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => "Réclamation avec l'ID {$id} non trouvée"
            ], 404);
        } catch (\Exception $e) {
            Log::error("Error fetching reclamation: ID {$id}", ['exception' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement de la réclamation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store observation and reject reclamation.
     * POST /api/admin/observations/reject/{id}
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function rejectStore(Request $request, $id)
    {
        try {
            $request->validate([
                'reclamation' => 'required|string|min:1|max:65535'
            ]);

            $reclamation = Reclamation::findOrFail($id);

            // Prevent re-rejection if already rejected
            if ($reclamation->status === 'rejeté') {
                return response()->json([
                    'success' => false,
                    'message' => 'La réclamation est déjà rejetée'
                ], 400);
            }

            // Check for required fields
            if (is_null($reclamation->rc) || is_null($reclamation->ice)) {
                Log::error("Missing rc or ice for reclamation ID {$id}", [
                    'rc' => $reclamation->rc,
                    'ice' => $reclamation->ice
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Les champs rc ou ice sont manquants dans la réclamation'
                ], 422);
            }

            // Log the data being inserted
            Log::info("Attempting to create observation for reclamation ID {$id}", [
                'reclamation_id' => $reclamation->id,
                'rc' => $reclamation->rc,
                'ice' => $reclamation->ice,
                'nom_entreprise_post' => $reclamation->nom_entreprise_post,
                'nom_entreprise_fraud' => $reclamation->nom_entreprise_fraud,
                'reclamation' => $request->reclamation
            ]);

            // Create observation
            $observation = Observation::create([
                'reclamation_id' => $reclamation->id,
                'rc' => $reclamation->rc,
                'ice' => $reclamation->ice,
                'nom_entreprise_post' => $reclamation->nom_entreprise_post,
                'nom_entreprise_fraud' => $reclamation->nom_entreprise_fraud,
                'reclamation' => $request->reclamation,
            ]);

            // Update reclamation status
            $reclamation->status = 'rejeté';
            $reclamation->save();

            return response()->json([
                'success' => true,
                'message' => 'Réclamation rejetée avec observation',
                'data' => [
                    'reclamation' => $reclamation,
                    'observation' => $observation
                ]
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error("Reclamation not found for rejection: ID {$id}", ['exception' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => "Réclamation avec l'ID {$id} non trouvée"
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error("Validation error during rejection: ID {$id}", ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (QueryException $e) {
            Log::error("Database error during rejection: ID {$id}", [
                'exception' => $e->getMessage(),
                'sql' => $e->getSql(),
                'bindings' => $e->getBindings()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur de base de données lors du rejet de la réclamation',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            Log::error("Unexpected error during rejection: ID {$id}", ['exception' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du rejet de la réclamation',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
