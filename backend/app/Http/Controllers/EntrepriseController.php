<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class EntrepriseController extends Controller
{
    public function index()
    {
        $entreprises = Entreprise::with('secteur')->get();
        return response()->json($entreprises, 200);
    }

    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:accepté,refusé',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $entreprise = Entreprise::findOrFail($id);
        $entreprise->status = $request->input('status');
        $entreprise->save();

        return response()->json([
            'message' => 'Statut mis à jour avec succès',
            'entreprise' => $entreprise
        ], 200);
    }
    public function search(Request $request)
    {
        try {
            $query = Entreprise::with('secteur'); // Define $query as a query builder instance

            // Get search term and filter type from query parameters
            $term = $request->query('term');
            $filter = $request->query('filter', 'username'); // Default to 'username'

            if ($term) {
                $term = strtolower($term);
                if ($filter === 'username') {
                    $query->whereRaw('LOWER(username) LIKE ?', ["%{$term}%"]);
                } elseif ($filter === 'address') {
                    $query->whereRaw('LOWER(address) LIKE ?', ["%{$term}%"]);
                } elseif ($filter === 'secteur.nom') {
                    $query->whereHas('secteur', function ($q) use ($term) {
                        $q->whereRaw('LOWER(nom) LIKE ?', ["%{$term}%"]); // Use 'nom' as per your data
                    });
                }
            }

            $entreprises = $query->get(); // Execute the query after applying filters
            return response()->json($entreprises, 200);
        } catch (\Exception $e) {
            Log::error('Error in search method: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
