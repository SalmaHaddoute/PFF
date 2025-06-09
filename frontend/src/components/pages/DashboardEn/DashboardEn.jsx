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
                <div className="card mb-4 border-0 shadow-sm">
                    <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
                        <h5 className="mb-0 fw-semibold">Entreprises Blacklistées</h5>
                        <div className="d-flex align-items-center">
                            <div className="me-3">
                                <select className="form-select form-select-sm" id="entries-select">
                                    <option value="10">10 entrées par page</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                            <div className="input-group input-group-sm" style={{width: '200px'}}>
                                <input type="text" className="form-control" placeholder="Rechercher..." />
                                <button className="btn btn-outline-secondary" type="button">
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="py-3 px-4 text-uppercase small fw-semibold">ID</th>
                                        <th className="py-3 px-4 text-uppercase small fw-semibold">Signalé par</th>
                                        <th className="py-3 px-4 text-uppercase small fw-semibold">Entreprise frauduleuse</th>
                                        <th className="py-3 px-4 text-uppercase small fw-semibold">Raison</th>
                                        <th className="py-3 px-4 text-uppercase small fw-semibold">Preuve</th>
                                        <th className="py-3 px-4 text-uppercase small fw-semibold">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.blacklist.slice(0, 4).map((entry) => (
                                        <tr className="border-top" key={entry.id}>
                                            <td className="py-3 px-4">{entry.id}</td>
                                            <td className="py-3 px-4">{entry.nom_entreprise_post}</td>
                                            <td className="py-3 px-4 fw-semibold">{entry.nom_entreprise_fraud}</td>
                                            <td className="py-3 px-4 text-muted">{entry.raison}</td>
                                            <td className="py-3 px-4">
                                                {entry.preuve_file ? (
                                                    <span className="badge bg-light text-dark border">
                                                        <i className="fas fa-comment-alt me-1"></i> Message
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-light text-muted border">Aucune preuve</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-muted">
                                                {new Date(entry.date_publication).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        <div className="d-flex justify-content-between align-items-center p-3 bg-light">
                            <div className="text-muted small">
                                Affichage de 1 à {Math.min(4, stats.blacklist.length)} sur {stats.blacklist.length} entrées
                            </div>
                            <div className="d-flex">
                                <button className="btn btn-sm btn-outline-secondary disabled me-2">
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-primary active me-2">1</button>
                                <button className="btn btn-sm btn-outline-secondary disabled">
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardEn;