<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Admin
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::user()->admin) { // Assumes admin is a boolean in the users or entreprises table
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }
}
