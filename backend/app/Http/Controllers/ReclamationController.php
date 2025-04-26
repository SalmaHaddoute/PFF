<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reclamation;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ReclamationController extends Controller
{
    public function store(Request $request)
    {
        
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Authentication details',
                'user' => auth()->user(),
                'token_valid' => auth()->check(),
                'token' => $request->bearerToken()
            ], 401);
        }
    
        // Validation des données
        $validator = Validator::make($request->all(), [
            'id_entreprise' => 'required|integer',
            'rc' => 'required|string',
            'ice' => 'required|string',
            'nom_entreprise_post' => 'required|string',
            'nom_entreprise_fraud' => 'required|string',
            'raison' => 'required|string',
            'preuve_file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Stocker le fichier
            $filePath = $request->file('preuve_file')->store('preuves');

            $reclamation = Reclamation::create([
                'id_entreprise' => $request->id_entreprise,
                'rc' => $request->rc,
                'ice' => $request->ice,
                'nom_entreprise_post' => $request->nom_entreprise_post,
                'nom_entreprise_fraud' => $request->nom_entreprise_fraud,
                'raison' => $request->raison,
                'preuve_path' => $filePath,
                'status' => 'en attente',
            ]);

            return response()->json([
                'message' => 'Réclamation créée avec succès',
                'data' => $reclamation
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}