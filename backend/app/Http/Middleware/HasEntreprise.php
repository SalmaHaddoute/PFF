<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HasEntreprise
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    // app/Http/Middleware/HasEntreprise.php
public function handle($request, Closure $next)
{
    if (!auth()->user()->entreprise_id) {
        return response()->json(['message' => 'Unauthorized - No entreprise associated'], 403);
    }

    return $next($request);
}
}
