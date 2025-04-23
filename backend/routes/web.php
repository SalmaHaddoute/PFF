<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\EntrepriseController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [LoginController::class, 'login']);
Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);
Route::middleware(['auth:entreprise'])->group(function () {
    Route::get('/entreprise/dashboard', [EntrepriseController::class, 'dashboard']);

});

  Route::post('/logout', [LoginController::class, 'logout'])->middleware('auth:sanctum');
