<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Entreprise;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);
    
        // Tentative de connexion Admin (fonctionne déjà)
        if (Auth::guard('admin')->attempt($credentials)) {
            return response()->json([
                'success' => true,
                'redirect' => '/admin/dashboard'
            ]);
        }
    
        // Tentative de connexion Entreprise - NOUVELLE METHODE
        $entreprise = Entreprise::where('email', $credentials['email'])->first();
    
        if ($entreprise && Hash::check($credentials['password'], $entreprise->motdepasse)) {
            // Authentification manuelle
            Auth::guard('entreprise')->login($entreprise);
            $request->session()->regenerate();
    
            switch ($entreprise->status) {
                case Entreprise::STATUS_ACCEPTED:
                    return response()->json([
                        'success' => true,
                        'redirect' => '/entreprise/dashboardEn'
                    ]);
                    
                case Entreprise::STATUS_PENDING:
                    Auth::guard('entreprise')->logout();
                    return response()->json([
                        'success' => false,
                        'message' => 'Votre compte est en attente de validation.'
                    ], 403);
                    
                case Entreprise::STATUS_REJECTED:
                    Auth::guard('entreprise')->logout();
                    return response()->json([
                        'success' => false,
                        'message' => 'Votre compte a été refusé.'
                    ], 403);
            }
        }
    
        return response()->json([
            'success' => false,
            'message' => 'Identifiants incorrects'
        ], 401);
    }
    public function logout(Request $request)
    {
        // Déconnexion pour Admin et Entreprise
        if (Auth::guard('admin')->check()) {
            Auth::guard('admin')->logout();
        } elseif (Auth::guard('entreprise')->check()) {
            Auth::guard('entreprise')->logout();
        }

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('welcome');
    }
}