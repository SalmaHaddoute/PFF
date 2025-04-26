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
    
        // Connexion Admin
        if (Auth::guard('admin')->attempt($credentials)) {
            $admin = Auth::guard('admin')->user();
            return response()->json([
                'success' => true,
                'redirect' => '/admin/dashboard',
                'user' => [
                    'nom' => $admin->nom,
                    'email' => $admin->email,
                    'role' => 'admin'
                ]
            ]);
        }
    
        // Connexion Entreprise
          // Connexion Entreprise
    $entreprise = Entreprise::where('email', $credentials['email'])->first();

    if ($entreprise && Hash::check($credentials['password'], $entreprise->motdepasse)) {
        switch ($entreprise->status) {
            case Entreprise::STATUS_ACCEPTED:
                Auth::guard('entreprise')->login($entreprise);
                $request->session()->regenerate();
                
                // Créer un token Sanctum
                $token = $entreprise->createToken('entreprise-token')->plainTextToken;
                
                return response()->json([
                    'success' => true,
                    'redirect' => '/entreprise/dashboard',
                    'token' => $token,
                    'user' => [
                        'id' => $entreprise->id,
                        'username' => $entreprise->username,
                        'rc' => $entreprise->rc,
                        'ice' => $entreprise->ice,
                        'email' => $entreprise->email,
                        'role' => 'entreprise'
                    ]
                ]);
                    
                case Entreprise::STATUS_PENDING:
                    return response()->json([
                        'success' => false,
                        'message' => 'Votre compte est en attente de validation.'
                    ], 403);
                    
                case Entreprise::STATUS_REJECTED:
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