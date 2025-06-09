<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\Blacklist;
use App\Models\Technicien;

class AdminDashboardController extends Controller
{
    /**
     * GET /api/admin/dashboard
     */
    public function index()
    {
        // Statistiques principales
        $stats = [
            'total_posts' => DB::table('reclamations')->count(),
            'accepted_posts' => DB::table('reclamations')
                ->where('status', 'validé')
                ->count(),
            'rejected_posts' => DB::table('reclamations')
                ->where('status', 'rejeté')
                ->count(),
            'total_techniciens' => Technicien::count(), // Count from techniciens table
        ];

        // Données pour les graphiques
        $chartData = [
            'statuts' => DB::table('reclamations')
                ->select('status', DB::raw('COUNT(*) as count'))
                ->groupBy('status')
                ->get(),
            'reclamations_par_mois' => DB::table('reclamations')
                ->select(DB::raw("DATE_FORMAT(post_date, '%Y-%m') as month"), DB::raw('COUNT(*) as count'))
                ->groupBy('month')
                ->orderBy('month')
                ->get(),
            'top_signaleurs' => DB::table('reclamations')
                ->select('nom_entreprise_post', DB::raw('COUNT(*) as count'))
                ->groupBy('nom_entreprise_post')
                ->orderBy('count', 'DESC')
                ->limit(5)
                ->get(),
        ];

        // Liste des blacklist avec pagination
        $blacklist = Blacklist::orderBy('post_date', 'DESC')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'charts' => $chartData,
                'blacklist' => [
                    'current_page' => $blacklist->currentPage(),
                    'data' => $blacklist->items(),
                    'total' => $blacklist->total(),
                    'per_page' => $blacklist->perPage(),
                    'last_page' => $blacklist->lastPage(),
                ],
            ],
            'meta' => [
                'last_updated' => now()->toDateTimeString(),
            ],
        ]);
    }
}
