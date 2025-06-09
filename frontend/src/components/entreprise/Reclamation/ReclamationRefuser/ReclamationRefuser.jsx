import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './ReclamationRefuser.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useAuth } from '../../../../context/AuthContext';

const ReclamationRefuser = () => {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [showResendPopup, setShowResendPopup] = useState(false);
    const [selectedReclamation, setSelectedReclamation] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const API_BASE_URL = 'http://localhost:8000/api';
    
    // Récupération des données de l'utilisateur connecté
    const { user, token } = useAuth();

    const fetchReclamationsRejetees = useCallback(async () => {
        try {
            setLoading(true);
            
            const response = await axios.get(
                `${API_BASE_URL}/entreprise/reclamations/check`,
                { 
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    timeout: 10000 
                }
            );
    
            if (response.data.success) {
                // D'abord, filtrer par statut (refusé ou rejeté)
                const reclamationsRejetees = response.data.data.reclamations.filter(
                    rec => ['refusé', 'rejeté'].includes(rec.status)
                );
                
                // Ensuite, filtrer par entreprise connectée
                const reclamationsEntreprise = reclamationsRejetees.filter(rec => {
                    return rec.nom_entreprise_post === user.username;
                });
                
                console.log('Réclamations refusées de l\'entreprise:', reclamationsEntreprise);
                
                // Afficher tous les champs disponibles
                if (reclamationsEntreprise.length > 0) {
                    console.log('STRUCTURE COMPLÈTE DE LA RÉCLAMATION:');
                    console.log(JSON.stringify(reclamationsEntreprise[0], null, 2));
                    console.log('Champs disponibles:', Object.keys(reclamationsEntreprise[0]).join(', '));
                    
                    // Vérifier les champs qui pourraient contenir l'observation
                    const possibleFields = ['observation', 'note', 'admin_note', 'feedback', 'comment', 'reject_reason', 'raison_admin', 'motif', 'motif_rejet'];
                    possibleFields.forEach(field => {
                        console.log(`Champ ${field}:`, reclamationsEntreprise[0][field]);
                    });
                } else {
                    console.log('Aucune réclamation trouvée pour examiner les champs');
                }
                
                console.log('Nom de l\'entreprise connectée:', user.username);
                
                setPublications(reclamationsEntreprise);
            }
        } catch (err) {
            console.error('Erreur:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL, token, user]);
    
    // Effet pour charger les réclamations refusées lorsque l'utilisateur est connecté
    useEffect(() => {
        if (user) {
            fetchReclamationsRejetees();
        }
    }, [user, fetchReclamationsRejetees]);
    
    const handleShowMessage = async (publication) => {
        setIsProcessing(true);
        console.log('Récupération de l\'observation pour la réclamation ID:', publication.id);
        
        try {
            // Récupérer l'observation depuis l'API en utilisant l'ID de la réclamation
            const response = await axios.get(
                `${API_BASE_URL}/observations/${publication.id}`,
                { 
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            console.log('Réponse de l\'API observation:', response.data);
            
            if (response.data && response.data.data) {
                // Traiter les données selon la structure de la table observations
                let observationData = null;
                
                // Déterminer si les données sont un tableau ou un objet unique
                if (Array.isArray(response.data.data)) {
                    // Prendre la dernière observation (la plus récente)
                    if (response.data.data.length > 0) {
                        observationData = response.data.data[response.data.data.length - 1];
                    }
                } else {
                    // Si c'est un objet unique
                    observationData = response.data.data;
                }
                
                if (observationData) {
                    // Extraire le contenu de la colonne 'reclamation' qui contient l'observation de l'administrateur
                    const observationText = observationData.reclamation || 'Aucune observation fournie';
                    const rcInfo = observationData.rc ? `<p><strong>RC:</strong> ${observationData.rc}</p>` : '';
                    const iceInfo = observationData.ice ? `<p><strong>ICE:</strong> ${observationData.ice}</p>` : '';
                    
                    // Créer un message HTML formaté avec l'observation
                    const message = `
                        <div class="observation-info">
                            <h5>Observation de l'administrateur</h5>
                            <div class="observation-content p-3 bg-light rounded mb-3">
                                <p>${observationText}</p>
                            </div>
                            <h6>Détails de la réclamation #${publication.id}</h6>
                            <p><strong>Date de l'observation:</strong> ${new Date(observationData.created_at).toLocaleString()}</p>
                            <p><strong>Entreprise signalante:</strong> ${observationData.nom_entreprise_post || publication.nom_entreprise_post || 'Non spécifié'}</p>
                            <p><strong>Entreprise signalée:</strong> ${observationData.nom_entreprise_fraud || publication.nom_entreprise_fraud || 'Non spécifié'}</p>
                            ${rcInfo}
                            ${iceInfo}
                            <p><strong>Statut:</strong> <span class="badge bg-danger">${publication.status || 'Non spécifié'}</span></p>
                        </div>
                    `;
                    
                    setPopupMessage(message);
                } else {
                    // Si aucune donnée d'observation n'est trouvée
                    const message = `
                        <div class="observation-info">
                            <h5>Aucune observation disponible</h5>
                            <p>L'administrateur n'a pas laissé d'observation pour cette réclamation.</p>
                            <hr/>
                            <h6>Détails de la réclamation #${publication.id}</h6>
                            <p><strong>Statut:</strong> <span class="badge bg-danger">${publication.status || 'Non spécifié'}</span></p>
                        </div>
                    `;
                    
                    setPopupMessage(message);
                }
            } else {
                // Message par défaut si aucune observation n'est trouvée
                const message = `
                    <div class="observation-info">
                        <h5>Aucune observation disponible</h5>
                        <p>L'administrateur n'a pas laissé d'observation pour cette réclamation.</p>
                        <hr/>
                        <h6>Détails de la réclamation #${publication.id}</h6>
                        <p><strong>Statut:</strong> <span class="badge bg-danger">${publication.status || 'Non spécifié'}</span></p>
                    </div>
                `;
                
                setPopupMessage(message);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'observation:', error);
            
            // Message d'erreur formaté
            const errorMessage = `
                <div class="observation-info">
                    <h5>Erreur de récupération</h5>
                    <p>Impossible de récupérer l'observation pour cette réclamation.</p>
                    <p class="text-danger">${error.message}</p>
                    <hr/>
                    <p>Veuillez contacter l'administrateur pour plus d'informations.</p>
                </div>
            `;
            
            setPopupMessage(errorMessage);
        } finally {
            setIsProcessing(false);
            setShowPopup(true);
        }
    };

    const handleResend = (reclamation) => {
        setSelectedReclamation(reclamation);
        setShowResendPopup(true);
    };

    const confirmResend = async () => {
        setIsProcessing(true);
        
        try {
            // Vérification basique
            if (!selectedReclamation?.id) {
                throw new Error("Aucune réclamation sélectionnée");
            }
    
            const response = await axios.post(
                `${API_BASE_URL}/entreprise/reclamations/${selectedReclamation.id}/resend`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    timeout: 10000 // Timeout de 10 secondes
                }
            );
    
            if (response.data?.success) {
                // 1. Fermer la popup de confirmation
                setShowResendPopup(false);
                
                // 2. Rafraîchir la liste
                await fetchReclamationsRejetees();
                
                // 3. Afficher message de succès
                setPopupMessage("Réclamation renvoyée avec succès !");
                setShowPopup(true);
                
                // 4. Fermer après 3s
                setTimeout(() => setShowPopup(false), 3000);
            } else {
                throw new Error(response.data?.message || "Erreur inconnue");
            }
        } catch (err) {
            console.error("Erreur:", err);
            setPopupMessage(`Échec: ${err.message}`);
            setShowPopup(true);
        } finally {
            setIsProcessing(false);
        }
    };
    


    const closePopup = () => {
        setShowPopup(false);
        setShowResendPopup(false);
        setPopupMessage("");
    };

    const getFileIcon = (filename) => {
        if (!filename) return null;

        const extension = filename.split('.').pop().toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            return <i className="bi bi-images"></i>;
        } else if (extension === 'pdf') {
            return <i className="bi bi-file-earmark-pdf"></i>;
        } else {
            return <i className="bi bi-download"></i>;
        }
    };

    if (loading) {
        return <div className="text-center my-5">Chargement en cours...</div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center">{error}</div>;
    }

    return (
        <main className="p-6">
            <div>
                <div className="container-fluid px-4">
                    <ol className="breadcrumb text-light p-3 rounded shadow-sm">
                        <li className="breadcrumb-item">
                            <a href="/dashboard" className="text-warning">
                                Dashboard
                            </a>
                        </li>
                        <li className="breadcrumb-item active text-light-dark">Listes des réclamations rejetées</li>
                    </ol>
                    <div className="card-body">
                        <div className="table-container">
                            <div className="table-wrapper">
                                <div className="table-scroll">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Entreprise Réclamante</th>
                                                <th>Entreprise Frauduleuse</th>
                                                <th>Raison</th>
                                                <th>Preuve</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {publications.length > 0 ? (
                                                publications.map((publication) => (
                                                    <tr key={publication.id}>
                                                        <td className="id">{publication.id}</td>
                                                        <td>{publication.nom_entreprise_post}</td>
                                                        <td>{publication.nom_entreprise_fraud}</td>
                                                        <td>{publication.raison}</td>
                                                        <td>
                                                            {publication.preuve_file ? (
                                                                <a 
                                                                    href={`${API_BASE_URL}/files/${publication.preuve_file}`}
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="proof-link"
                                                                >
                                                                    {getFileIcon(publication.preuve_file)}
                                                                </a>
                                                            ) : (
                                                                <span className="no-proof">Aucune preuve</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <span className={`badge bg-${publication.status === 'rejeté' || publication.status === 'refusé' ? 'danger' : 'warning'}`}>
                                                                {publication.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="actions">
                                                                <button 
                                                                    onClick={() => handleShowMessage(publication)}
                                                                    className="show-message"
                                                                    title="Voir observation de l'administrateur">
                                                                    <i className="bi bi-question-circle"></i>
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleResend(publication)}
                                                                    className="resend-btn ms-2"
                                                                    title="Renvoyer la réclamation">
                                                                    <i className="bi bi-arrow-repeat text-dark"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="no-data">
                                                        Aucune réclamation rejetée trouvée.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Popup Overlay pour les observations */}
                {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup popup-large">
                            <span className="close-btn" onClick={closePopup}>×</span>
                            {isProcessing ? (
                                <div className="text-center p-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Chargement...</span>
                                    </div>
                                    <p className="mt-3">Chargement de l'observation...</p>
                                </div>
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: popupMessage }} />
                            )}
                            <button 
                                onClick={closePopup}
                                className="btn btn-primary mt-3"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}

                {/* Popup Overlay pour la confirmation de renvoi */}
                {showResendPopup && (
    <div className="popup-overlay">
        <div className="popup">
            <h5>Confirmation</h5>
            <p>Voulez-vous vraiment renvoyer cette réclamation ?</p>
            
            <div className="d-flex justify-content-end gap-2 mt-3">
                <button 
                    onClick={confirmResend}
                    className="btn btn-primary"
                    disabled={isProcessing}
                >
                    {isProcessing ? 'En cours...' : 'Confirmer'}
                </button>
                <button 
                    onClick={closePopup}
                    className="btn btn-outline-secondary"
                >
                    Annuler
                </button>
            </div>
        </div>
    </div>
)}
                {/* Overlay de chargement */}
                {isProcessing && (
                    <div className="overlay-loader">
                        <div className="loader"></div>
                    </div>
                )}
            </div> 
        </main>
    );
};

export default ReclamationRefuser;