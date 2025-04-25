<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use Illuminate\Http\Request;

class EntrepriseController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('admin')->only(['verifiedEntreprise', 'updateStatus']);
        $this->middleware('entreprise')->only(['index']);
    }

    // GET /api/entreprise/dashboard
    public function index()
    {
        $entreprises = Entreprise::with('secteur')->get();
        return response()->json([
            'success' => true,
            'data' => $entreprises
        ]);
    }

    // GET /api/admin/entreprises/verification
    public function verifiedEntreprise()
    {
        $entreprises = Entreprise::with('secteur')
            ->whereIn('status', ['en attente', 'pending', 'accepté', 'refusé'])
            ->orderBy('created_at', 'desc')
            ->get();
    
        return response()->json([
            'success' => true,
            'data' => $entreprises
        ]);
    }

    // GET /api/admin/entreprises/search?search=...&filter=...
    public function search(Request $request)
    {
        $request->validate([
            'search' => 'sometimes|string',
            'filter' => 'sometimes|in:username,address,secteur.nom'
        ]);
    
        $query = Entreprise::with('secteur');
    
        if ($request->filled('search') && $request->filled('filter')) {
            if ($request->filter === 'secteur.nom') {
                $query->whereHas('secteur', function($q) use ($request) {
                    $q->where('nom', 'like', '%'.$request->search.'%');
                });
            } else {
                $query->where($request->filter, 'like', '%'.$request->search.'%');
            }
        }
    
        $entreprises = $query->paginate(10);
    
        return response()->json([
            'success' => true,
            'data' => $entreprises,
            'search_params' => [
                'term' => $request->search ?? null,
                'filter' => $request->filter ?? null
            ]
        ]);
    }

    // GET /api/admin/entreprises/{id}
    public function show(Entreprise $entreprise)
    {
        return response()->json([
            'success' => true,
            'data' => $entreprise->load('secteur')
        ]);
    }

    // PUT /api/admin/entreprises/{id}/status
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:accepté,refusé'
        ]);

        $entreprise = Entreprise::findOrFail($id);
        $entreprise->status = $validated['status'];
        $entreprise->save();

        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour avec succès',
            'data' => $entreprise
        ]);
    }
}