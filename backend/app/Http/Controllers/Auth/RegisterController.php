<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Entreprise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class RegisterController extends Controller
{
    public function __construct()
    {
        // Middleware et initialisation si nécessaire
    }

    public function register(Request $request)
{
    try {
        // Valider les données
        $validated = $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:entreprises',
            'motdepasse' => 'required|string|min:8',
            'rc' => 'required|string|size:8|unique:entreprises',
            'ice' => 'required|string|size:15|unique:entreprises',
            'id_secteur' => 'required|exists:secteurs,id',
            'address' => 'required|string'
        ]);

        // Créer l'entreprise avec tous les champs requis
        $entreprise = Entreprise::create([
            'username' => $validated['username'],
            'email' => $validated['email'],
            'motdepasse' => Hash::make($validated['motdepasse']),
            'rc' => $validated['rc'],
            'ice' => $validated['ice'],
            'id_secteur' => $validated['id_secteur'],
            'address' => $validated['address'],
            'status' => Entreprise::STATUS_PENDING,
            'date_creation' => now() // Ajout explicite de la date
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Inscription réussie!',
            'data' => $entreprise
        ], 201);

    } catch (\Exception $e) {
        Log::error('Erreur inscription: '.$e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de l\'inscription',
            'error' => $e->getMessage() // Retourne l'erreur exacte
        ], 500);
    }
}
    // Méthode pour gérer les requêtes OPTIONS (pré-vol)
    public function handleOptionsRequest()
    {
        return response()->json()
            ->withHeaders([
                'Access-Control-Allow-Origin' => 'http://localhost:5173',
                'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization'
            ]);
    }
}