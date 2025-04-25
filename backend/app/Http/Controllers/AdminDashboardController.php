<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('admin');
    }

    public function index()
    {
        // Récupération des statistiques
        $data = [];
        
        // 1. Évolution des inscriptions
        $data['inscriptions'] = DB::table('entreprises')
            ->select(DB::raw("DATE_FORMAT(date_creation, '%Y-%m') AS mois"), DB::raw('COUNT(*) AS total'))
            ->groupBy('mois')
            ->orderBy('mois')
            ->get();
            
        // 2. Évolution des signalements
        $data['signalements'] = DB::table('publications')
            ->select(DB::raw("DATE_FORMAT(date_publication, '%Y-%m') AS mois"), DB::raw('COUNT(*) AS total'))
            ->groupBy('mois')
            ->orderBy('mois')
            ->get();
            
        // 3. Top entreprises signalées
        $data['top_entreprises'] = DB::table('publications')
            ->select('nom_entreprise_fraud', DB::raw('COUNT(*) AS total'))
            ->groupBy('nom_entreprise_fraud')
            ->orderBy('total', 'DESC')
            ->limit(5)
            ->get();
            
        // 4. Répartition des statuts
        $data['statuts'] = DB::table('publications')
            ->select('status', DB::raw('COUNT(*) AS nombre'))
            ->groupBy('status')
            ->get();
            
        // Totaux
        $data['totals'] = [
            'posts' => DB::table('publications')->count(),
            'accepted_posts' => DB::table('publications')->where('status', 'validé')->count(),
            'rejected_posts' => DB::table('publications')->where('status', 'rejeté')->count(),
            'products' => DB::table('products')->count()
        ];
        
        // Blacklist
        $data['blacklist'] = DB::table('blacklists')->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function indexCharts()
    {
        // Les mêmes données que pour index() mais avec un format potentiellement différent
        $chartData = [];
        
        // Formatage spécifique pour les graphiques
        $chartData['inscriptions'] = DB::table('entreprises')
            ->select(DB::raw("DATE_FORMAT(date_creation, '%Y-%m') AS mois"), DB::raw('COUNT(*) AS total'))
            ->groupBy('mois')
            ->orderBy('mois')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->mois => $item->total];
            });
            
        // Autres données pour les graphiques...

        return response()->json([
            'success' => true,
            'data' => $chartData
        ]);
    }
}