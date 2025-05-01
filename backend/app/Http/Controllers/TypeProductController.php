<?php

namespace App\Http\Controllers;

use App\Models\TypeProduct;
use Illuminate\Http\Request;

class TypeProductController extends Controller
{
   
    /**
     * GET /api/admin/type-products
     * Liste tous les types de produits
     */
    public function index()
    {
        $types = TypeProduct::orderBy('nom')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => [
                'types' => $types->items(),
                'pagination' => [
                    'total' => $types->total(),
                    'current_page' => $types->currentPage(),
                    'per_page' => $types->perPage(),
                    'last_page' => $types->lastPage()
                ]
            ]
        ]);
    }

    /**
     * POST /api/admin/type-products
     * Crée un nouveau type de produit
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|unique:type_products,nom|max:255'
        ]);

        $type = TypeProduct::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Type de produit créé avec succès',
            'data' => $type
        ], 201);
    }

    /**
     * GET /api/admin/type-products/{id}
     * Affiche un type spécifique
     */
    public function show(TypeProduct $typeProduct)
    {
        return response()->json([
            'success' => true,
            'data' => $typeProduct
        ]);
    }

    /**
     * PUT /api/admin/type-products/{id}
     * Met à jour un type de produit
     */
    public function update(Request $request, TypeProduct $typeProduct)
    {
        $validated = $request->validate([
            'nom' => 'required|unique:type_products,nom,'.$typeProduct->id.'|max:255'
        ]);

        $typeProduct->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Type de produit mis à jour avec succès',
            'data' => $typeProduct
        ]);
    }

    /**
     * DELETE /api/admin/type-products/{id}
     * Supprime un type de produit
     */
    public function destroy(TypeProduct $typeProduct)
    {
        $typeProduct->delete();

        return response()->json([
            'success' => true,
            'message' => 'Type de produit supprimé avec succès'
        ], 204);
    }
}
