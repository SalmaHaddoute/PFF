<?php

namespace App\Http\Controllers;

use App\Models\Blacklist;
use App\Models\Observation;
use App\Models\Publication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PublicationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('admin');
    }

    /**
     * GET /api/admin/publications/check
     * Liste toutes les publications à vérifier
     */
    public function checkPosts()
    {
        $publications = Publication::query()
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => [
                'publications' => $publications->items(),
                'pagination' => [
                    'total' => $publications->total(),
                    'current_page' => $publications->currentPage(),
                    'per_page' => $publications->perPage(),
                    'last_page' => $publications->lastPage()
                ]
            ]
        ]);
    }

    /**
     * PUT /api/admin/publications/{id}/status
     * Met à jour le statut d'une publication
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:validé,rejeté',
        ]);

        DB::beginTransaction();

        try {
            $publication = Publication::findOrFail($id);
            $publication->status = $request->status;
            $publication->save();

            if ($request->status === 'validé') {
                Blacklist::updateOrCreate(
                    ['id_entreprise' => $publication->id_entreprise],
                    [
                        'nom_entreprise_post' => $publication->nom_entreprise_post,
                        'nom_entreprise_fraud' => $publication->nom_entreprise_fraud,
                        'raison' => $publication->raison,
                        'preuve_file' => $publication->preuve_file,
                        'post_date' => now(),
                    ]
                );
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Statut de la publication mis à jour',
                'data' => $publication
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
     * POST /api/admin/publications/{id}/reject
     * Rejette une publication avec observation
     */
    public function rejectStore(Request $request, $id)
    {
        $request->validate([
            'reclamation' => 'required|string|max:1000',
        ]);

        DB::beginTransaction();

        try {
            $publication = Publication::findOrFail($id);

            $observation = Observation::create([
                'publication_id' => $publication->id,
                'reclamation' => $request->reclamation,
                'nom_entreprise_post' => $publication->nom_entreprise_post,
                'nom_entreprise_fraud' => $publication->nom_entreprise_fraud,
            ]);

            $publication->status = 'rejeté';
            $publication->save();

            Blacklist::where('id_entreprise', $publication->id_entreprise)->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Publication rejetée avec observation',
                'data' => [
                    'publication' => $publication,
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