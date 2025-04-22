<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Entreprise;
use App\Models\Admin;

class LoginController extends Controller
{
    public function showLoginForm()
    {
        return view('login');
    }

    public function login(Request $request)
        {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string'  // Changé de motdepasse à password
            ]);
        
            if (Auth::guard('admin')->attempt($request->only('email', 'password'))) {
                $request->session()->regenerate();
                
                return response()->json([
                    'success' => true,
                    'redirect' => '/admin/dashboard'
                ]);
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
