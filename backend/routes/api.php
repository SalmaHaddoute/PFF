<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\Auth\AdminAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlacklistController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\EntrepriseDashboardController;
use App\Http\Controllers\ObservationController;
use App\Http\Controllers\ReclamationController;
use App\Http\Controllers\ReclamationEnController;
use App\Http\Controllers\SecteurController;
use App\Http\Controllers\SecteurControllercopy;
use App\Http\Controllers\TechnicienController;

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
Route::get('/test-connection', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Laravel API is working!',
        'data' => [
            'framework' => 'Laravel',
            'version' => app()->version(),
            'time' => now()->toDateTimeString()
        ]
    ]);
});
// routes/api.php
Route::get('/test-cors', function() {
    return response()->json([
        'message' => 'CORS is working!',
        'data' => ['test' => 123]
    ]);
});
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});




Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Auth routes pour utilisateurs normaux
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Route d'enregistrement pour les entreprises
Route::post('/register-entreprise', [EntrepriseController::class, 'register']);

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/secteurs', function() {
    try {
        return response()->json(\App\Models\Secteur::all());
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTrace()
        ], 500);
    }
});
Route::prefix('entreprise')->group(function () {
    Route::post('login', [EntrepriseAuthController::class, 'login']);
    Route::middleware('auth:entreprise')->group(function () {
        Route::get('user', [EntrepriseAuthController::class, 'user']);
        Route::post('logout', [EntrepriseAuthController::class, 'logout']);
    });
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
    });

    // Entreprise routes
    Route::prefix('entreprise')->group(function () {
        Route::get('/dashboard', [EntrepriseController::class, 'dashboard']);
    });
});
/////////////////////////

Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);
Route::get('/admin/statistiques', [AdminDashboardController::class, 'indexCharts']);
Route::get('/entreprises', [EntrepriseController::class, 'index']);
Route::put('/entreprises/{id}/status', [EntrepriseController::class, 'updateStatus']);
Route::get('/entreprises/search', [EntrepriseController::class, 'search']);
Route::get('/admin/secteur', [SecteurControllercopy::class, 'index']);
Route::post('/admin/secteur', [SecteurControllercopy::class, 'store']);
Route::put('/admin/secteur/{id}', [SecteurControllercopy::class, 'update']);
Route::delete('/admin/secteur/{id}', [SecteurControllercopy::class, 'destroy']);

    Route::get('/admin/Reclamations/check', [ReclamationController::class, 'checkPosts']);
    Route::get('/admin/Reclamations/{id}', [ReclamationController::class, 'show']);
    Route::put('/admin/Reclamations/{id}/status', [ReclamationController::class, 'updateStatus']);
    Route::post('/admin/Reclamations/{id}/reject', [ReclamationController::class, 'rejectStore']);
        Route::get('/admin/observations/reclamation/{id}', [ObservationController::class, 'showReclamation']);
        Route::post('/admin/observations/reject/{id}', [ObservationController::class, 'rejectStore']);
        Route::get('/admin/reclamations/rejected', [ReclamationController::class, 'getRejected']);
        Route::post('/admin/reclamations/repost/{id}', [ReclamationController::class, 'repost']);
       // New routes
    Route::get('/admin/rejected', [ReclamationController::class, 'listRejected']);
    Route::put('/admin/{id}/repost', [ReclamationController::class, 'repost']);
    Route::get('/admin/{id}/observation', [ReclamationController::class, 'showObservation']);
    Route::get('/admin/blacklists', [BlacklistController::class, 'index']);
// Gestion des fichiers
Route::get('/uploads/{file}', function ($file) {
    $path = storage_path('app/uploads/' . $file);

    if (!file_exists($path)) {
        return response()->json(['error' => 'File not found'], 404);
    }

    return response()->file($path);
})->where('file', '.*');
//////////////////////////////////////////////////
Route::middleware('api')->group(function () {
    // Routes pour les entreprises

    Route::get('/blacklists', [BlacklistController::class, 'index']);

    Route::prefix('entreprise')->group(function () {
        Route::get('/dashboard', [EntrepriseDashboardController::class, 'index']);
        Route::get('/statistiques', [EntrepriseDashboardController::class, 'indexCharts']);
        Route::get('/', [EntrepriseController::class, 'index']);
        Route::get('/search', [EntrepriseController::class, 'search']);
        Route::put('/{id}/status', [EntrepriseController::class, 'updateStatus']);


        Route::prefix('reclamations')->group(function() {
            Route::get('', [ReclamationEnController::class, 'index']);
            Route::post('', [ReclamationEnController::class, 'store']);
            Route::get('/check', [ReclamationEnController::class, 'checkPosts']);
            Route::put('/{id}/status', [ReclamationEnController::class, 'updateStatus']);
            Route::post('/{id}/reject', [ReclamationEnController::class, 'rejectStore']);
            Route::get('/{id}', [ReclamationEnController::class, 'show']); // Correction ici
            Route::put('/{id}', [ReclamationEnController::class, 'update']); // Correction ici
            Route::delete('/{id}', [ReclamationEnController::class, 'destroy']);
            Route::post('/{id}/resend', [ReclamationEnController::class, 'resendReclamation']);
            Route::get('/blacklist', [ReclamationEnController::class, 'getBlacklistedReclamations']);
        });

        Route::prefix('techniciens')->group(function() {
            Route::post('', [TechnicienController::class, 'store']);
            Route::get('', [TechnicienController::class, 'index']);
            Route::put('/{id}', [TechnicienController::class, 'update']);
            Route::delete('/{id}', [TechnicienController::class, 'destroy']);
            Route::get('/search', [TechnicienController::class, 'search']);
        });


    });
    // Dans api.php
Route::get('/secteurs', function() {
    return \App\Models\Secteur::all();
});

    // Gestion des fichiers
    Route::get('/files/{file}', function ($file) {
        $path = storage_path('app/uploads/' . $file);
        if (!file_exists($path)) {
            return response()->json(['error' => 'File not found'], 404);
        }
        return response()->file($path);
    })->where('file', '.*');
});
