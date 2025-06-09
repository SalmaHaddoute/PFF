<?php

namespace App\Http\Controllers;

use App\Models\Blacklist;
use App\Models\Observation;
use App\Models\Reclamation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ReclamationEnController extends Controller
{
    /**
     * GET /api/admin/Reclamations/check
     * Liste toutes les Reclamations à vérifier
     */
    /**
 * POST /api/entreprise/reclamations
 * Crée une nouvelle réclamation
 */
/**
 * POST /api/entreprise/reclamations
 * Crée une nouvelle réclamation
 */
public function index()
{
    $reclamations = Reclamation::query()
        ->orderBy('created_at', 'desc')
        ->paginate(10);

    return response()->json([
        'success' => true,
        'data' => $reclamations
    ]);
}
// Dans ReclamationController.php

/**
 * GET /api/entreprise/reclamations/blacklist
 * Récupère les réclamations acceptées (présentes dans la blacklist)
 */
/**

 * GET /api/entreprise/reclamations/blacklist
 * 1. Récupère les réclamations acceptées pour l'entreprise.
 * 2. Ajoute TOUTES les entreprises frauduleuses (`nom_entreprise_fraud`) à la blacklist (même si elles y sont déjà).
 * 3. Retourne les réclamations blacklistées.
 */

public function store(Request $request)
    {
        // Validate incoming request
        $validated = $request->validate([
            'id_entreprise' => 'required|integer',
            'rc' => 'required|string',
            'ice' => 'required|string',
            'nom_entreprise_post' => 'required|string',
            'nom_entreprise_fraud' => 'required|string',
            'raison' => 'required|string',
            'preuve_file' => 'required|file|mimes:png,jpg,pdf|max:2048', // Adjust as needed
          'post_date' => 'required|date_format:Y-m-d H:i:s', // Validate MySQL datetime format
        ]);

        // Handle file upload
        $path = $request->file('preuve_file')->store('preuves', 'public');

        // Create reclamation
        $reclamation = Reclamation::create([
            'id_entreprise' => $validated['id_entreprise'],
            'rc' => $validated['rc'],
            'ice' => $validated['ice'],
            'nom_entreprise_post' => $validated['nom_entreprise_post'],
            'nom_entreprise_fraud' => $validated['nom_entreprise_fraud'],
            'raison' => $validated['raison'],
            'preuve_file' => $path,
            'post_date' => $validated['post_date'],
            'status' => 'en attente',
        ]);

        return response()->json([
            'success' => true,
            'data' => $reclamation,
        ], 201);
    }
public function checkPosts()
{
    $reclamations = Reclamation::query()
        ->orderBy('created_at', 'desc')
        ->paginate(10);

    return response()->json([
        'success' => true,
        'data' => [
            'reclamations' => $reclamations->map(function($reclamation) {
                return [
                    'id' => $reclamation->id,
                    'nom_entreprise_post' => $reclamation->nom_entreprise_post,
                    'nom_entreprise_fraud' => $reclamation->nom_entreprise_fraud,
                    'raison' => $reclamation->raison,
                    'preuve_file' => $reclamation->preuve_file,
                    'status' => $reclamation->status,
                    'post_date' => $reclamation->post_date
                ];
            }),
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
                'data' => [
                    'rc' => $reclamation->rc,
                    'ice' => $reclamation->ice,
                    'nom_entreprise_post' => $reclamation->nom_entreprise_post,
                    'nom_entreprise_fraud' => $reclamation->nom_entreprise_fraud,
                    'raison' => $reclamation->raison,
                    'preuve_file' => $reclamation->preuve_file,
                    'status' => $reclamation->status,
                    'post_date' => $reclamation->post_date
                ]
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
/**
 * PUT /api/admin/Reclamations/{id}/status
 * Met à jour le statut d'une reclamation
 */
/**
 * PUT /api/admin/Reclamations/{id}/status
 * Met à jour le statut d'une reclamation
 */
public function updateStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|in:accepté,rejeté',
    ]);

    try {
        $reclamation = Reclamation::findOrFail($id);
        $reclamation->status = $request->status;
        $reclamation->save();

        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour avec succès',
            'data' => $reclamation
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur: ' . $e->getMessage()
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
    /**
 * POST /api/entreprise/reclamations/{id}/resend
 * Renvoie une réclamation rejetée
 */
public function resendReclamation($id)
{
    DB::beginTransaction();

    try {
        $reclamation = Reclamation::findOrFail($id);

        if (!in_array($reclamation->status, ['rejeté', 'refusé'])) {
            return response()->json([
                'success' => false,
                'message' => 'Seules les réclamations rejetées/refusées peuvent être renvoyées'
            ], 400);
        }

        $reclamation->update([
            'status' => 'en attente',
            'updated_at' => now()
        ]);

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Réclamation renvoyée avec succès',
            'data' => $reclamation
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => 'Erreur serveur',
            'error' => $e->getMessage()
        ], 500);
    }
}
    /**
 * DELETE /api/entreprise/reclamations/{id}
 * Supprime une réclamation
 */
public function destroy($id)
{
    DB::beginTransaction();

    try {
        $reclamation = Reclamation::findOrFail($id);
        $reclamation->delete();

        // Supprimer le fichier associé si nécessaire
        Storage::disk('public')->delete($reclamation->preuve_file);

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Réclamation supprimée avec succès'
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la suppression',
            'error' => $e->getMessage()
        ], 500);
    }
}
/**
 * PUT /api/entreprise/reclamations/{id}
 * Met à jour une réclamation
 */
/**
 * PUT /api/entreprise/reclamations/{id}
 * Met à jour une réclamation
 */
public function update(Request $request, $id)
{
    $validated = $request->validate([
        'nom_entreprise_fraud' => 'required|string|max:255',
        'raison' => 'required|string',
        'preuve_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        'rc' => 'nullable|string|max:50',
        'ice' => 'nullable|string|max:50',
        'nom_entreprise_post' => 'nullable|string|max:255'
    ]);

    DB::beginTransaction();

    try {
        $reclamation = Reclamation::findOrFail($id);

        // Mise à jour des champs de base
        $reclamation->nom_entreprise_fraud = $request->input('nom_entreprise_fraud');
        $reclamation->raison = $request->input('raison');

        // Mise à jour des champs optionnels s'ils sont présents
        if ($request->has('rc')) {
            $reclamation->rc = $request->input('rc');
        }

        if ($request->has('ice')) {
            $reclamation->ice = $request->input('ice');
        }

        if ($request->has('nom_entreprise_post')) {
            $reclamation->nom_entreprise_post = $request->input('nom_entreprise_post');
        }

        // Gestion du fichier de preuve
        if ($request->hasFile('preuve_file')) {
            // Supprimer l'ancien fichier s'il existe
            if ($reclamation->preuve_file) {
                Storage::disk('public')->delete($reclamation->preuve_file);
            }

            // Enregistrer le nouveau fichier
            $path = $request->file('preuve_file')->store('preuves', 'public');
            $reclamation->preuve_file = $path;
        }

        $reclamation->save();

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Réclamation mise à jour avec succès',
            'data' => $reclamation
        ]);

    } catch (\Exception $e) {
        DB::rollBack();

        Log::error('Erreur lors de la mise à jour de la réclamation', [
            'id' => $id,
            'error' => $e->getMessage(),
            'stack' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la mise à jour de la réclamation',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
