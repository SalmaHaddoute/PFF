<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    // app/Http/Middleware/VerifyCsrfToken.php
protected $except = [
    'sanctum/csrf-cookie',
    'login' // Ajoutez cette ligne pour désactiver CSRF sur /login
];

// app/Http/Controllers/Auth/LoginController.php
public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|string'
    ]);

    if (Auth::guard('admin')->attempt($request->only('email', 'password'))) {
        $request->session()->regenerate();
        
        return response()->json([
            'success' => true,
            'redirect' => '/dashboard' // Assurez-vous que cette route existe
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Identifiants incorrects'
    ], 401);
}}
