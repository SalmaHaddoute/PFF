<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class EntrepriseDashboardController extends Controller
{
    /**
     * GET /statistiques
     */
    public function indexCharts()
    {
        // Données brutes pour les graphiques
        $rawData = [
            'statuts' => DB::table('reclamations')
                ->select('status', DB::raw('COUNT(*) as count'))
                ->groupBy('status')
                ->get(),

            'reclamations_par_mois' => DB::table('reclamations')
                ->select(DB::raw("DATE_FORMAT(date_publication, '%Y-%m') as month"), DB::raw('COUNT(*) as count'))
                ->groupBy('month')
                ->orderBy('month')
                ->get(),

            'top_reclamants' => DB::table('reclamations')
                ->select('nom_entreprise_post', DB::raw('COUNT(*) as count'))
                ->groupBy('nom_entreprise_post')
                ->orderBy('count', 'DESC')
                ->limit(5)
                ->get(),

            'total_reclamations' => DB::table('reclamations')->count(),

            'all_reclamations' => DB::table('reclamations')
                ->orderBy('date_publication', 'DESC')
                ->get()
        ];

        return response()->json([
            'success' => true,
            'data' => $rawData,
            'meta' => [
                'last_updated' => now()->toDateTimeString()
            ]
        ]);
    }
}