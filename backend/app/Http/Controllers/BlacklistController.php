<?php

namespace App\Http\Controllers;

use App\Models\Blacklist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BlacklistController extends Controller
{
    /**
     * Display paginated blacklist items
     * GET /api/blacklists
     */
    public function index(Request $request)
    {
        $perPage = $request->per_page ?? 10;

        $blacklist = Blacklist::query()
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $blacklist->items(),
            'meta' => [
                'total' => $blacklist->total(),
                'current_page' => $blacklist->currentPage(),
                'per_page' => $blacklist->perPage(),
                'last_page' => $blacklist->lastPage(),
            ]
        ]);
    }
    // Dans BlacklistController.php
public function getBlacklist(Request $request)
{
    $perPage = $request->per_page ?? 10;

    $blacklist = Blacklist::query()
        ->orderBy('created_at', 'desc')
        ->paginate($perPage);

    return response()->json([
        'success' => true,
        'data' => $blacklist->items(),
        'meta' => [
            'total' => $blacklist->total(),
            'current_page' => $blacklist->currentPage(),
            'per_page' => $blacklist->perPage(),
            'last_page' => $blacklist->lastPage(),
        ]
    ]);
}
    /**
     * Display single blacklist item
     * GET /api/blacklists/{id}
     */
    public function show($id)
    {
        $item = Blacklist::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $item
        ]);
    }
}
