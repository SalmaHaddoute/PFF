<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EntrepriseMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
  public function handle($request, Closure $next)
{
    if (!auth()->guard('entreprise')->check()) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $user = auth()->guard('entreprise')->user();

    if ($user->status !== 'accepte') {
        return response()->json(['message' => 'Account not approved'], 403);
    }

    return $next($request);
}
}
