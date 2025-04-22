<?php

namespace App\Http\Controllers;

use App\Models\Blacklist;
use Illuminate\Http\Request;

class BlacklistController extends Controller
{
    public function __construct()
    {
        // Protection de toutes les routes avec Sanctum
        $this->middleware('auth:sanctum');
        
        // Seuls les admins peuvent accéder à ces endpoints
        $this->middleware('admin')->except(['indexEn']);
        
        // La version anglaise peut être accessible par d'autres rôles
        $this->middleware('entreprise')->only(['indexEn']);
    }

    /**
     * Display a listing of the resource (French version)
     * GET /api/admin/blacklist
     */
    public function index()
    {
        $blacklist = Blacklist::all();
        
        return response()->json([
            'success' => true,
            'data' => $blacklist,
            'meta' => [
                'total' => $blacklist->count(),
                'language' => 'fr'
            ]
        ]);
    }

    /**
     * English version of the blacklist
     * GET /api/entreprise/blacklist/en
     */
    public function indexEn()
    {
        $blacklist = Blacklist::all();
        
        return response()->json([
            'success' => true,
            'data' => $blacklist,
            'meta' => [
                'total' => $blacklist->count(),
                'language' => 'en'
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * POST /api/admin/blacklist
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'reason' => 'required|string',
            'source' => 'nullable|string',
            'date_added' => 'nullable|date'
        ]);

        $blacklistItem = Blacklist::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Item added to blacklist successfully',
            'data' => $blacklistItem
        ], 201);
    }

    /**
     * Display the specified resource.
     * GET /api/admin/blacklist/{id}
     */
    public function show(string $id)
    {
        $blacklistItem = Blacklist::findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $blacklistItem
        ]);
    }

    /**
     * Update the specified resource in storage.
     * PUT/PATCH /api/admin/blacklist/{id}
     */
    public function update(Request $request, string $id)
    {
        $blacklistItem = Blacklist::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'reason' => 'sometimes|string',
            'source' => 'nullable|string',
            'date_added' => 'nullable|date'
        ]);

        $blacklistItem->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Blacklist item updated successfully',
            'data' => $blacklistItem
        ]);
    }

    /**
     * Remove the specified resource from storage.
     * DELETE /api/admin/blacklist/{id}
     */
    public function destroy(string $id)
    {
        $blacklistItem = Blacklist::findOrFail($id);
        $blacklistItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Blacklist item removed successfully'
        ], 204);
    }
}