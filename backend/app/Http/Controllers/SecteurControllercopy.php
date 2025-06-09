<?php

namespace App\Http\Controllers;

use App\Models\Secteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SecteurControllercopy extends Controller
{
    /**
     * Display a listing of sectors with pagination.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $limit = 5; // Items per page
        $page = $request->query('page', 1);

        try {
            $secteurs = Secteur::select('id', 'nom')
                ->paginate($limit, ['*'], 'page', $page);

            return response()->json([
                'secteurs' => $secteurs->items(),
                'totalPages' => $secteurs->lastPage(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la récupération des secteurs',
            ], 500);
        }
    }

    /**
     * Store a newly created sector in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Le nom du secteur est requis',
            ], 422);
        }

        try {
            $nom = trim($request->input('nom'));

            // Check if sector already exists
            if (Secteur::where('nom', $nom)->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Ce secteur existe déjà',
                ], 409);
            }

            $secteur = Secteur::create(['nom' => $nom]);

            return response()->json([
                'status' => 'success',
                'message' => 'Secteur ajouté avec succès',
                'secteur' => $secteur,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de l\'ajout du secteur',
            ], 500);
        }
    }

    /**
     * Update the specified sector in storage.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Le nom du secteur est requis',
            ], 422);
        }

        try {
            $secteur = Secteur::findOrFail($id);
            $nom = trim($request->input('nom'));

            // Check if another sector with the same name exists
            if (Secteur::where('nom', $nom)->where('id', '!=', $id)->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Ce nom de secteur est déjà utilisé',
                ], 409);
            }

            $secteur->nom = $nom;
            $secteur->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Secteur modifié avec succès',
                'secteur' => $secteur,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la modification du secteur',
            ], 500);
        }
    }

    /**
     * Remove the specified sector from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $secteur = Secteur::findOrFail($id);
            $secteur->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Secteur supprimé avec succès',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la suppression du secteur',
            ], 500);
        }
    }
}
