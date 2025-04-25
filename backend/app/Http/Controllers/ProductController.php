<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('admin'); // Seuls les admins peuvent accéder
    }

    /**
     * GET /api/admin/products
     * Liste paginée des produits avec leurs relations
     */
    public function index()
    {
        $products = Product::with(['entreprise', 'typeProduct'])
                        ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => [
                'products' => $products->items(),
                'pagination' => [
                    'current_page' => $products->currentPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                    'last_page' => $products->lastPage(),
                    'next_page_url' => $products->nextPageUrl(),
                    'prev_page_url' => $products->previousPageUrl()
                ]
            ]
        ]);
    }

    /**
     * POST /api/admin/products
     * Créer un nouveau produit
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'entreprise_id' => 'required|exists:entreprises,id',
            'type_product_id' => 'required|exists:type_products,id'
        ]);

        $product = Product::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Produit créé avec succès',
            'data' => $product->load(['entreprise', 'typeProduct'])
        ], 201);
    }

    /**
     * GET /api/admin/products/{id}
     * Afficher un produit spécifique
     */
    public function show(Product $product)
    {
        return response()->json([
            'success' => true,
            'data' => $product->load(['entreprise', 'typeProduct'])
        ]);
    }

    /**
     * PUT/PATCH /api/admin/products/{id}
     * Mettre à jour un produit
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'entreprise_id' => 'sometimes|exists:entreprises,id',
            'type_product_id' => 'sometimes|exists:type_products,id'
        ]);

        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Produit mis à jour avec succès',
            'data' => $product->fresh(['entreprise', 'typeProduct'])
        ]);
    }

    /**
     * DELETE /api/admin/products/{id}
     * Supprimer un produit
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produit supprimé avec succès'
        ], 204);
    }
}