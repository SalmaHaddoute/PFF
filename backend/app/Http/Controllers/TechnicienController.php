<?php
namespace App\Http\Controllers;

use App\Models\Technicien;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TechnicienController extends Controller
{
    public function index()
    {
        try {
            $techniciens = Technicien::with('secteur')->get();
    
            return response()->json([
                'success' => true,
                'data' => $techniciens->map(function($technicien) {
                    return [
                        'id' => $technicien->id,
                        'cin' => $technicien->cin,
                        'nom' => $technicien->nom,
                        'adresse' => $technicien->adresse,
                        'email' => $technicien->email,
                        'telephone' => $technicien->telephone,
                        'id_secteur' => $technicien->id_secteur,
                        'secteur_nom' => $technicien->secteur->nom ?? 'Non spécifié'
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des techniciens',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cin' => 'required|unique:techniciens|max:20',
            'nom' => 'required|max:100',
            'adresse' => 'required|max:255',
            'email' => 'required|email|unique:techniciens',
            'telephone' => 'required|max:20',
            'id_secteur' => 'required|exists:secteurs,id',
            'id_entreprise' => 'required'
            
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $technicien = Technicien::create($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Technicien ajouté avec succès',
                'data' => $technicien
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du technicien',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function update(Request $request, $id)
{
    $validator = Validator::make($request->all(), [
        'cin' => 'sometimes|required|unique:techniciens,cin,'.$id.'|max:20',
        'nom' => 'sometimes|required|max:100',
        'adresse' => 'sometimes|required|max:255',
        'email' => 'sometimes|required|email|unique:techniciens,email,'.$id,
        'telephone' => 'sometimes|required|max:20',
        'id_secteur' => 'sometimes|required|exists:secteurs,id'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $validator->errors()
        ], 422);
    }

    try {
        $technicien = Technicien::findOrFail($id);
        $technicien->update($request->all());
        
        return response()->json([
            'success' => true,
            'message' => 'Technicien mis à jour avec succès',
            'data' => $technicien
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la mise à jour du technicien',
            'error' => $e->getMessage()
        ], 500);
    }
}
/**
 * GET /api/entreprise/techniciens/search
 * Recherche des techniciens
 */
public function search(Request $request)
{
    try {
        $query = Technicien::query()->with('secteur');

        if ($request->has('nom')) {
            $query->where('nom', 'like', '%'.$request->nom.'%');
        }
        if ($request->has('cin')) {
            $query->where('cin', 'like', '%'.$request->cin.'%');
        }
        if ($request->has('adresse')) {
            $query->where('adresse', 'like', '%'.$request->adresse.'%');
        }
        if ($request->has('email')) {
            $query->where('email', 'like', '%'.$request->email.'%');
        }
        if ($request->has('telephone')) {
            $query->where('telephone', 'like', '%'.$request->telephone.'%');
        }

        $techniciens = $query->get()->map(function($technicien) {
            return [
                'id' => $technicien->id,
                'cin' => $technicien->cin,
                'nom' => $technicien->nom,
                'adresse' => $technicien->adresse,
                'email' => $technicien->email,
                'telephone' => $technicien->telephone,
                'secteur_nom' => $technicien->secteur->nom ?? 'N/A'
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $techniciens
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la recherche',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function destroy($id)
{
    try {
        $technicien = Technicien::findOrFail($id);
        $technicien->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Technicien supprimé avec succès'
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la suppression',
            'error' => $e->getMessage()
        ], 500);
    }
}

    // ... autres méthodes (index, update, destroy) ...
}