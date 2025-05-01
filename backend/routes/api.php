<?php

use App\Http\Controllers\PublicationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\BlacklistController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\EntrepriseDashboardController;
use App\Http\Controllers\ObservationController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReclamationController;
use App\Http\Controllers\SecteurController;
use App\Http\Controllers\TypeProductController;



Route::middleware('api')->group(function () {
    // Route de vérification du statut de l'API
    Route::get('/status', function () {
        return response()->json([
            'status' => 'API is running',
            'version' => '1.0',
            'timestamp' => now()
        ]);
    });

    // Routes publiques accessibles à tous
    // Route::get('/secteurs', [SecteurController::class, 'index']);
    Route::get('/produits', [ProductController::class, 'index']);
    Route::get('/blacklist', [BlacklistController::class, 'index']);
    // Route::get('/entreprises', [EntrepriseController::class, 'index']);
    // Route::get('/entreprises/{entreprise}', [EntrepriseController::class, 'show']);

    // Routes pour l'administration
    Route::prefix('admin')->group(function () {
        // Dashboard admin
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);
        Route::get('/statistiques', [AdminDashboardController::class, 'indexCharts']);


        // // Gestion des secteurs
        // Route::post('/secteurs', [SecteurController::class, 'store']);

        // Gestion des types de produits
        Route::post('/types-produits', [TypeProductController::class, 'store']);

        // Gestion des publications
        Route::prefix('publications')->group(function() {
            Route::get('/check', [PublicationController::class, 'checkPosts']);
            Route::put('/{id}', [PublicationController::class, 'updateStatus']);
            Route::post('/{id}/reject', [PublicationController::class, 'rejectStore']);
        });
    });

    // Routes pour les entreprises
    Route::prefix('entreprise')->group(function () {
        Route::get('/dashboard', [EntrepriseDashboardController::class, 'index']);
        Route::get('/statistiques', [EntrepriseDashboardController::class, 'indexCharts']);
    });

    // // Gestion des fichiers
    // Route::get('/files/{file}', function ($file) {
    //     $path = storage_path('app/uploads/' . $file);

    //     if (!file_exists($path)) {
    //         return response()->json(['error' => 'File not found'], 404);
    //     }

    //     return response()->file($path);
    // })->where('file', '.*');
    //partie admin
// New route for ChercherEn
Route::get('/entreprises', [EntrepriseController::class, 'index']);
Route::put('/entreprises/{id}/status', [EntrepriseController::class, 'updateStatus']);
Route::get('/entreprises/search', [EntrepriseController::class, 'search']);
Route::get('/admin/secteur', [SecteurController::class, 'index']);
Route::post('/admin/secteur', [SecteurController::class, 'store']);
Route::put('/admin/secteur/{id}', [SecteurController::class, 'update']);
Route::delete('/admin/secteur/{id}', [SecteurController::class, 'destroy']);

    Route::get('/admin/Reclamations/check', [ReclamationController::class, 'checkPosts']);
    Route::get('/admin/Reclamations/{id}', [ReclamationController::class, 'show']);
    Route::put('/admin/Reclamations/{id}/status', [ReclamationController::class, 'updateStatus']);
    Route::post('/admin/Reclamations/{id}/reject', [ReclamationController::class, 'rejectStore']);




     Route::get('/admin/ajouter-observation{id}', [ObservationController::class, 'showReclamation']);
     Route::post('/admin/observations/reject/{id}', [ObservationController::class, 'rejectStore']);

});
