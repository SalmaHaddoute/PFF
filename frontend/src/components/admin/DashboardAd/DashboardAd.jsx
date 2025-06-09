import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardAd.css';
import { IonIcon } from '@ionic/react';
import Charts from '../ChartsAd/Charts.jsx';
import { 
    documentTextOutline,
    checkmarkCircleOutline,
    closeCircleOutline,
    cubeOutline
} from 'ionicons/icons';

const DashboardAd = () => {
    const [dashboardData, setDashboardData] = useState({
        total_posts: 0,
        accepted_posts: 0,
        rejected_posts: 0,
        total_techniciens: 0,
        blacklist: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const API_BASE_URL = 'http://localhost:8000/api';

    // Fetch dashboard data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token
                    }
                });

                console.log('API Response:', response.data); // Debug log

                // Access nested stats and blacklist
                const { stats, blacklist } = response.data.data;

                setDashboardData({
                    total_posts: stats.total_posts || 0,
                    accepted_posts: stats.accepted_posts || 0,
                    rejected_posts: stats.rejected_posts || 0,
                    total_techniciens: stats.total_techniciens || 0,
                    blacklist: blacklist.data || [] // Use paginated blacklist data
                });
                setLoading(false);
            } catch (err) {
                console.error('Fetch data error:', err.response || err);
                setError(err.response?.data?.message || 'Erreur lors du chargement des données');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Render proof badge based on file type
    const renderProofBadge = (file) => {
        if (!file) {
            return <span className="badge bg-light text-muted border">Aucune preuve</span>;
        }

        const extension = file.split('.').pop().toLowerCase();
        const fileUrl = `http://localhost:8000/storage/${file}`; // Fixed URL

        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            return (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    <span className="badge bg-light text-dark border">
                        <i className="fas fa-image me-1"></i> Image
                    </span>
                </a>
            );
        } else if (extension === 'pdf') {
            return (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    <span className="badge bg-light text-dark border">
                        <i className="fas fa-file-pdf me-1"></i> PDF
                    </span>
                </a>
            );
        } else {
            return (
                <a href={fileUrl} download>
                    <span className="badge bg-light text-dark border">
                        <i className="fas fa-download me-1"></i> Fichier
                    </span>
                </a>
            );
        }
    };

    if (loading) {
        return <div className="text-center py-5">Chargement en cours...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="row">
            {/* Card Box */}
            <div className="cardBox">
                <div className="card">
                    <div>
                        <div className="numbers">{dashboardData.total_posts}</div>
                        <div className="cardName">Total réclamations</div>
                    </div>
                    <div className="iconBx">
                        <IonIcon icon={documentTextOutline} />
                    </div>
                </div>

                <div className="card">
                    <div>
                        <div className="numbers">{dashboardData.accepted_posts}</div>
                        <div className="cardName">Réclamations Validée</div>
                    </div>
                    <div className="iconBx">
                        <IonIcon icon={checkmarkCircleOutline} />
                    </div>
                </div>
                
                <div className="card">
                    <div>
                        <div className="numbers">{dashboardData.rejected_posts}</div>
                        <div className="cardName">Réclamations rejetées</div>
                    </div>
                    <div className="iconBx">
                        <IonIcon icon={closeCircleOutline} />
                    </div>
                </div>

                <div className="card">
                    <div>
                        <div className="numbers">{dashboardData.total_techniciens}</div>
                        <div className="cardName">Total techniciens</div>
                    </div>
                    <div className="iconBx">
                        <IonIcon icon={cubeOutline} />
                    </div>
                </div>
            </div>

            {/* Charts */}
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
                            <div className="input-group input-group-sm" style={{ width: '200px' }}>
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
                                    {dashboardData.blacklist.slice(0, 4).map((entry) => (
                                        <tr className="border-top" key={entry.id}>
                                            <td className="py-3 px-4">{entry.id}</td>
                                            <td className="py-3 px-4">{entry.nom_entreprise_post}</td>
                                            <td className="py-3 px-4 fw-semibold">{entry.nom_entreprise_fraud}</td>
                                            <td className="py-3 px-4 text-muted">{entry.raison}</td>
                                            <td className="py-3 px-4">{renderProofBadge(entry.preuve_file)}</td>
                                            <td className="py-3 px-4 text-muted">
                                                {new Date(entry.post_date).toLocaleDateString('fr-FR', {
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
                                Affichage de 1 à {Math.min(4, dashboardData.blacklist.length)} sur {dashboardData.blacklist.length} entrées
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

export default DashboardAd;