<?php

namespace App\Http\Controllers;

use App\Models\Secteur;
use Illuminate\Http\Request;

class SecteurController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index']);
        $this->middleware('admin')->except(['index']);
    }

    public function index()
    {
        $secteurs = Secteur::orderBy('nom')->get();
        
        return response()->json([
            'success' => true,
            'data' => $secteurs
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|unique:secteurs,nom|max:255'
        ]);

        $secteur = Secteur::create([
            'nom' => $request->nom
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Secteur créé avec succès',
            'data' => $secteur
        ], 201);
    }

    public function show(Secteur $secteur)
    {
        return response()->json([
            'success' => true,
            'data' => $secteur
        ]);
    }

    public function update(Request $request, Secteur $secteur)
    {
        $request->validate([
            'nom' => 'required|unique:secteurs,nom,'.$secteur->id.'|max:255'
        ]);

        $secteur->update([
            'nom' => $request->nom
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Secteur mis à jour avec succès',
            'data' => $secteur
        ]);
    }

    public function destroy(Secteur $secteur)
    {
        $secteur->delete();

        return response()->json([
            'success' => true,
            'message' => 'Secteur supprimé avec succès'
        ], 204);
    }
}