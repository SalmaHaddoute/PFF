<?php

namespace App\Http\Controllers;

use App\Models\Blacklist;
use App\Models\Observation;
use App\Models\Reclamation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReclamationController extends Controller
{
    /**
     * GET /api/admin/Reclamations/check
     * Liste toutes les Reclamations à vérifier
     */
    public function checkPosts()
    {
        $reclamations = Reclamation::query()
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => [
                'reclamations' => $reclamations->items(),
                'pagination' => [
                    'total' => $reclamations->total(),
                    'current_page' => $reclamations->currentPage(),
                    'per_page' => $reclamations->perPage(),
                    'last_page' => $reclamations->lastPage()
                ]
            ]
        ]);
    }

    /**
     * GET /api/admin/Reclamations/{id}
     * Récupère une reclamation par ID
     */
    public function show($id)
    {
        try {
            $reclamation = Reclamation::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $reclamation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Reclamation non trouvée',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * PUT /api/admin/Reclamations/{id}/status
     * Met à jour le statut d'une reclamation
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:validé,rejeté',
        ]);

        DB::beginTransaction();

        try {
            $reclamation = Reclamation::findOrFail($id);
            $reclamation->status = $request->status;
            $reclamation->save();

            if ($request->status === 'validé') {
                Blacklist::updateOrCreate(
                    ['id_entreprise' => $reclamation->id_entreprise],
                    [
                        'nom_entreprise_post' => $reclamation->nom_entreprise_post,
                        'nom_entreprise_fraud' => $reclamation->nom_entreprise_fraud,
                        'raison' => $reclamation->raison,
                        'preuve_file' => $reclamation->preuve_file,
                        'post_date' => now(),
                    ]
                );
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Statut de la reclamation mis à jour',
                'data' => $reclamation
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/admin/Reclamations/{id}/reject
     * Rejette une reclamation avec observation
     */
    public function rejectStore(Request $request, $id)
    {
        $request->validate([
            'reclamation' => 'required|string|max:1000',
        ]);

        DB::beginTransaction();

        try {
            $reclamation = Reclamation::findOrFail($id);

            $observation = Observation::create([
                'reclamation_id' => $reclamation->id,
                'reclamation' => $request->reclamation,
                'nom_entreprise_post' => $reclamation->nom_entreprise_post,
                'nom_entreprise_fraud' => $reclamation->nom_entreprise_fraud,
            ]);

            $reclamation->status = 'rejeté';
            $reclamation->save();

            Blacklist::where('id_entreprise', $reclamation->id_entreprise)->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Reclamation rejetée avec observation',
                'data' => [
                    'reclamation' => $reclamation,
                    'observation' => $observation
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du rejet',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
