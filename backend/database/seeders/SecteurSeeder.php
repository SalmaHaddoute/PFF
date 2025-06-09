<?php

namespace Database\Seeders;

use App\Models\Secteur;
use Illuminate\Database\Seeder;

class SecteurSeeder extends Seeder
{
    public function run()
    {
        $secteurs = [
            ['nom' => 'Technologie et Informatique',],
            ['nom' => 'Construction et BTP',],
            ['nom' => 'Santé et Médical',],
            [
                'nom' => 'Hôtellerie et Restauration',
            ],
            [
                'nom' => 'Commerce et Distribution',

            ],
            [
                'nom' => 'Industrie Manufacturière',

            ],
            [
                'nom' => 'Services Financiers',

            ],
            [
                'nom' => 'Transport et Logistique',

            ],
            [
                'nom' => 'Éducation et Formation',

            ],
            [
                'nom' => 'Agriculture et Agroalimentaire',
            ],
            [
                'nom' => 'Énergie et Utilities',

            ],
            [
                'nom' => 'Télécommunications',

            ],
            [
                'nom' => 'Médias et Communication',

            ],
            [
                'nom' => 'Artisanat et Métiers d\'Art',

            ],
            [
                'nom' => 'Associatif et ONG',

            ]
        ];

        foreach ($secteurs as $secteur) {
            Secteur::firstOrCreate(
                ['nom' => $secteur['nom']],
                $secteur
            );
        }
    }
}
