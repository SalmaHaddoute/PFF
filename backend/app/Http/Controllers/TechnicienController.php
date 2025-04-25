<?php

namespace App\Http\Controllers;

use App\Models\Technicien;
use App\Models\Secteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TechnicienController extends Controller
{
    // Ajouter un technicien
   // app/Http/Controllers/TechnicienController.php
public function store(Request $request)
{
    $validatedData = $request->validate([
        'cin' => 'required|unique:techniciens|max:255',
        'nom' => 'required|max:255',
        'prenom' => 'nullable|max:255',
        'adresse' => 'required',
        'email' => 'required|email|unique:techniciens',
        'telephone' => 'required',
        'id_secteur' => 'required|exists:secteurs,id',
        // Don't include id_entreprise in validation - it comes from auth
    ]);

    // Get the authenticated user's entreprise_id
    $entrepriseId = auth()->user()->entreprise_id;

    // Create the technicien with the entreprise_id
    $technicien = Technicien::create([
        ...$validatedData,
        'id_entreprise' => $entrepriseId
    ]);

    return response()->json([
        'message' => 'Technicien ajouté avec succès',
        'data' => $technicien
    ], 201);
}

    // Lister tous les techniciens
    public function index()
    {
        $techniciens = Technicien::with(['secteur', 'entreprise'])->get();

        return response()->json([
            'status' => 200,
            'techniciens' => $techniciens
        ], 200);
    }

    // Rechercher des techniciens
    public function search(Request $request)
    {
        $query = Technicien::with(['secteur', 'entreprise']);

        if ($request->has('filter') && $request->has('search')) {
            $filter = $request->filter;
            $search = $request->search;

            if ($filter === 'cin') {
                $query->where('cin', 'like', '%'.$search.'%');
            } elseif ($filter === 'adresse') {
                $query->where('adresse', 'like', '%'.$search.'%');
            } elseif ($filter === 'username') {
                $query->whereHas('entreprise', function($q) use ($search) {
                    $q->where('nom', 'like', '%'.$search.'%');
                });
            }
        }

        $techniciens = $query->get();

        return response()->json([
            'status' => 200,
            'techniciens' => $techniciens
        ], 200);
    }
}
