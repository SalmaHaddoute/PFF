<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
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
    /**
     * Register a new entreprise
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        Log::info('Entreprise registration attempt', ['data' => $request->all()]);
        
        $validator = Validator::make($request->all(), [
            'ice' => 'required|string|min:5|unique:entreprises',
            'rc' => 'required|string|unique:entreprises',
            'username' => 'required|string|min:3',
            'email' => 'required|email|unique:entreprises',
            'address' => 'required|string',
            'id_secteur' => 'required|exists:secteurs,id',
            'motdepasse' => 'required|string|min:6',
            'date_creation' => 'nullable|date'
        ]);

        if ($validator->fails()) {
            Log::warning('Entreprise registration validation failed', ['errors' => $validator->errors()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $entreprise = Entreprise::create([
                'ice' => $request->ice,
                'rc' => $request->rc,
                'username' => $request->username,
                'email' => $request->email,
                'address' => $request->address,
                'id_secteur' => $request->id_secteur,
                'motdepasse' => $request->motdepasse, // Le hachage est géré par le mutator dans le modèle
                'status' => Entreprise::STATUS_PENDING, // Statut par défaut en attente
                'date_creation' => $request->date_creation ?? now()
            ]);

            Log::info('Entreprise registered successfully', ['id' => $entreprise->id]);

            return response()->json([
                'status' => 'success',
                'message' => 'Entreprise enregistrée avec succès. Votre compte est en attente d\'approbation.',
                'entreprise' => $entreprise
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error during entreprise registration: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Une erreur est survenue lors de l\'enregistrement.'
            ], 500);
        }
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
