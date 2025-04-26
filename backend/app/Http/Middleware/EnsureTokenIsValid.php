<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTokenIsValid
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    // Dans app/Http/Middleware/EnsureTokenIsValid.php
public function handle($request, Closure $next)
{
    logger('Token reçu: '.$request->bearerToken());
    logger('Utilisateur authentifié: '.auth()->check());
    logger('Utilisateur: '.json_encode(auth()->user()));
    
    if (!auth()->check()) {
        return response()->json([
            'message' => 'Unauthenticated',
            'token_received' => $request->bearerToken(),
            'authenticated' => auth()->check(),
            'user' => auth()->user()
        ], 401);
    }

    return $next($request);
}
}
