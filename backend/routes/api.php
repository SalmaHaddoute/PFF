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
use App\Http\Controllers\TypeProductController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// In routes/api.php

Route::middleware('api')->group(function () {
    Route::options('/register', [RegisterController::class, 'handleOptionsRequest']);
Route::post('/register', [RegisterController::class, 'register']);
    // Authentification
    Route::post('/login', [LoginController::class, 'login']);
    Route::post('/logout', [LoginController::class, 'logout'])->middleware('auth:sanctum');

    // Public routes
    Route::get('/status', function () {
        return response()->json(['status' => 'API is running']);
    });
    
    // Remplacez la route existante par :
    Route::get('/secteurs', [SecteurController::class, 'index']);

    // Admin routes
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function() {
        // Dashboard
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);
        Route::get('/statistique', [AdminDashboardController::class, 'indexCharts']);
        
        // Entreprises
        Route::get('/entreprises', [EntrepriseController::class, 'index']);
        Route::get('/entreprises/verification', [EntrepriseController::class, 'verifiedEntreprise']);
        Route::put('/entreprises/{entreprise}/status', [EntrepriseController::class, 'updateStatus']);
        Route::get('/entreprises/search', [EntrepriseController::class, 'search']);
        Route::get('/entreprises/{entreprise}', [EntrepriseController::class, 'show']);
        
        // Secteurs (version admin)
        Route::post('/secteurs', [SecteurController::class, 'store']);
        
        // Types de produits
        Route::post('/types-produits', [TypeProductController::class, 'store']);
        
        // Produits
        Route::get('/produits', [ProductController::class, 'index']);
        
        // Publications
        Route::prefix('publications')->group(function() {
            Route::get('/check', [PublicationController::class, 'checkPosts']);
            Route::put('/{id}', [PublicationController::class, 'updateStatus']);
            Route::post('/{id}/reject', [PublicationController::class, 'rejectStore']);
        });
        
        // Blacklist
        Route::get('/blacklist', [BlacklistController::class, 'index']);
    });

    // Entreprise routes
    Route::middleware(['auth:sanctum', 'entreprise'])->prefix('entreprise')->group(function() {
        Route::get('/dashboard', [EntrepriseDashboardController::class, 'index']);
        Route::get('/statistique', [EntrepriseDashboardController::class, 'indexCharts']);
        Route::get('/blacklist', [BlacklistController::class, 'index']);
    });

    // Fichiers
    Route::get('/files/{file}', function ($file) {
        $path = storage_path('app/uploads/' . $file);
        
        if (!file_exists($path)) {
            return response()->json(['error' => 'File not found'], 404);
        }
        
        return response()->file($path);
    })->where('file', '.*');
});
