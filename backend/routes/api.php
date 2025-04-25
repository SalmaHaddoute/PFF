<?php

use App\Http\Controllers\PublicationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\BlacklistController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\EntrepriseDashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SecteurController;
use App\Http\Controllers\TechnicienController;
use App\Http\Controllers\TypeProductController;


Route::middleware(['auth:sanctum', 'has.entreprise'])->group(function() {
    Route::post('/techniciens/ajouter', [TechnicienController::class, 'store']);
});
Route::middleware('api')->group(function () {
    // Public routes (no auth)
    Route::options('/register', [RegisterController::class, 'handleOptionsRequest']);
    Route::post('/register', [RegisterController::class, 'register']);
    Route::post('/login', [LoginController::class, 'login']);
    Route::get('/status', function () { return response()->json(['status' => 'API is running']); });
    Route::get('/secteurs', [SecteurController::class, 'index']);

    // Protected routes (Sanctum auth required)
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/logout', [LoginController::class, 'logout']);

        // Admin-only routes
        Route::middleware(['check.user.type:admin'])->prefix('admin')->group(function () {
            Route::get('/dashboard', [AdminDashboardController::class, 'index']);
            Route::get('/statistique', [AdminDashboardController::class, 'indexCharts']);
            Route::get('/entreprises', [EntrepriseController::class, 'index']);
            Route::get('/entreprises/verification', [EntrepriseController::class, 'verifiedEntreprise']);
            Route::put('/entreprises/{entreprise}/status', [EntrepriseController::class, 'updateStatus']);
            Route::post('/secteurs', [SecteurController::class, 'store']);
            Route::post('/types-produits', [TypeProductController::class, 'store']);
            Route::prefix('publications')->group(function () {
                Route::get('/check', [PublicationController::class, 'checkPosts']);
                Route::put('/{id}', [PublicationController::class, 'updateStatus']);
                Route::post('/{id}/reject', [PublicationController::class, 'rejectStore']);
            });
            Route::get('/blacklist', [BlacklistController::class, 'index']);
        });

        // Entreprise-only routes
        Route::middleware(['check.user.type:entreprise'])->prefix('entreprise')->group(function () {
            Route::get('/dashboard', [EntrepriseDashboardController::class, 'index']);
            Route::get('/statistique', [EntrepriseDashboardController::class, 'index']);
            Route::get('/blacklist', [BlacklistController::class, 'index']);
            Route::prefix('techniciens')->group(function () {
                Route::post('/ajouter', [TechnicienController::class, 'store']);
                Route::get('/liste', [TechnicienController::class, 'index']);
                Route::get('/chercher', [TechnicienController::class, 'search']);
            });
        });


    });

    // Public file access (if needed)
    Route::get('/files/{file}', function ($file) {
        $path = storage_path('app/uploads/' . $file);
        return file_exists($path) ? response()->file($path) : response()->json(['error' => 'File not found'], 404);
    })->where('file', '.*');
});
