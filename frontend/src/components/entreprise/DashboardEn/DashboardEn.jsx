import React, { useEffect, useState } from 'react';
import './DashboardEn.css';
import { IonIcon } from '@ionic/react';
import Charts from '../ChartsEn/Charts.jsx';
import axios from 'axios';
import { 
    documentTextOutline,
    checkmarkCircleOutline,
    closeCircleOutline,
    cubeOutline
} from 'ionicons/icons';
import { Chart } from 'chart.js';
import MyBlacklist from '../MyBlacklist/MyBlacklist.jsx';

const DashboardEn= () => {
    const [stats, setStats] = useState({
        total_posts: 0,
        accepted_posts: 0,
        rejected_posts: 0,
        total_products: 0,
        blacklist: []
    });
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = 'http://127.0.0.1:8000/api';

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Récupérer les statistiques
                const statsResponse = await axios.get(`${API_BASE_URL}/entreprise/statistiques`);
                const statsData = statsResponse.data.data;
                
                // Récupérer la blacklist (supposons que c'est la même route)
                const blacklistResponse = await axios.get(`${API_BASE_URL}/blacklists`);
                const blacklistData = blacklistResponse.data.data.all_reclamations || [];

                setStats({
                    total_posts: statsData.total_reclamations || 0,
                    accepted_posts: statsData.statuts?.find(s => s.status === 'accepté')?.count || 0,
                    rejected_posts: statsData.statuts?.find(s => s.status === 'rejeté')?.count || 0,
                    total_products: 0, // À remplacer par votre logique de produits
                    blacklist: blacklistData
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="row">
                <div className="text-center py-5">Chargement des données...</div>
            </div>
        );
    }

    return (
        <div className="row">
            {/* Card Box */}
            <div className="cardBox">
                <div className="card">
                    <div>
                        <div className="numbers">{stats.total_posts}</div>
                        <div className="cardName">Total réclamations</div>
                    </div>
                    <div className="iconBx">
                        <IonIcon icon={documentTextOutline} />
                    </div>
                </div>

                <div className="card">
                    <div>
                        <div className="numbers">{stats.accepted_posts}</div>
                        <div className="cardName">Réclamations Validée</div>
                    </div>
                    <div className="iconBx">
                        <IonIcon icon={checkmarkCircleOutline} />
                    </div>
                </div>
                
                <div className="card">
                    <div>
                        <div className="numbers">{stats.rejected_posts}</div>
                        <div className="cardName">Réclamations rejetées</div>
                    </div>
                    <div className="iconBx">
                        <IonIcon icon={closeCircleOutline} />
                    </div>
                </div>

                <div className="card">
                    <div>
                        <div className="numbers">{stats.total_products}</div>
                        <div className="cardName">Total Produits</div>
                    </div>
                    <div className="iconBx">
                        <IonIcon icon={cubeOutline} />
                    </div>
                </div>
            </div>

            {/* charts */}
            <Charts />

            {/* Blacklisted Companies Table */}
            <div className="container-fluid px-4">
            <MyBlacklist />
            </div>
        </div>
    );
};

export default DashboardEn; 