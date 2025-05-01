<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EntrepriseDashboardController extends Controller
{


    /**
     * GET /api/entreprise/dashboard
     */
    public function index()
    {
        $rc = auth()->user()->rc;

        // Statistiques principales
        $stats = [
            'total_posts' => DB::table('publications')
                ->where('nom_entreprise_fraud', 'like', "%$rc%")
                ->count(),

            'accepted_posts' => DB::table('publications')
                ->where('nom_entreprise_fraud', 'like', "%$rc%")
                ->where('status', 'validé')
                ->count(),

            'rejected_posts' => DB::table('publications')
                ->where('nom_entreprise_fraud', 'like', "%$rc%")
                ->where('status', 'rejeté')
                ->count()
        ];

        // Données pour les graphiques
        $chartData = [
            'statuts' => DB::table('publications')
                ->where('nom_entreprise_fraud', 'like', "%$rc%")
                ->select('status', DB::raw('COUNT(*) as count'))
                ->groupBy('status')
                ->get(),

            'signalements_par_mois' => DB::table('publications')
                ->where('nom_entreprise_fraud', 'like', "%$rc%")
                ->select(DB::raw("DATE_FORMAT(date_publication, '%Y-%m') as month"), DB::raw('COUNT(*) as count'))
                ->groupBy('month')
                ->orderBy('month')
                ->get(),

            'top_signaleurs' => DB::table('publications')
                ->where('nom_entreprise_fraud', 'like', "%$rc%")
                ->select('nom_entreprise_post', DB::raw('COUNT(*) as count'))
                ->groupBy('nom_entreprise_post')
                ->orderBy('count', 'DESC')
                ->limit(5)
                ->get()
        ];

        // Liste des signalements avec pagination
        $signalements = DB::table('publications')
            ->where('nom_entreprise_fraud', 'like', "%$rc%")
            ->orderBy('date_publication', 'DESC')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'charts' => $chartData,
                'signalements' => [
                    'current_page' => $signalements->currentPage(),
                    'data' => $signalements->items(),
                    'total' => $signalements->total(),
                    'per_page' => $signalements->perPage(),
                    'last_page' => $signalements->lastPage()
                ],
                'entreprise_rc' => $rc
            ],
            'meta' => [
                'last_updated' => now()->toDateTimeString()
            ]
        ]);
    }
}
