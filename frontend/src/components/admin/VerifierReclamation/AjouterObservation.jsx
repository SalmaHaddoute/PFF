/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AjouterObservation.css';

const AjouterObservation = () => {
    const [publicationId, setPublicationId] = useState('');
    const [nomEntreprisePost, setNomEntreprisePost] = useState('');
    const [nomEntrepriseFraud, setNomEntrepriseFraud] = useState('');
    const [reclamation, setReclamation] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const API_BASE_URL = 'http://localhost:8000/api';

    // Fetch publication details based on ID from URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const id = queryParams.get('id');

        if (id) {
            const fetchPublication = async () => {
                // Corrected endpoint to match backend route
                const url = `${API_BASE_URL}/admin/observations/reclamation/${id}`;
                console.log('Fetching reclamation from:', url);
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            // Add Authorization header if needed
                            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error ${response.status}`);
                    }

                    const { data } = await response.json();
                    setPublicationId(data.id);
                    setNomEntreprisePost(data.nom_entreprise_post || '');
                    setNomEntrepriseFraud(data.nom_entreprise_fraud || '');
                    setError('');
                } catch (err) {
                    setError(err.message || 'Erreur lors du chargement de la réclamation');
                    console.error('Fetch error:', err);
                    setTimeout(() => setError(''), 3000);
                }
            };
            fetchPublication();
        } else {
            setError('ID de réclamation manquant dans l\'URL');
            setTimeout(() => setError(''), 3000);
        }
    }, [location]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!publicationId || !reclamation.trim()) {
            setError('L\'ID de la publication et la réclamation sont obligatoires.');
            setTimeout(() => setError(''), 3000);
            return;
        }

        // Endpoint to store observation and reject reclamation
        const url = `${API_BASE_URL}/admin/observations/reject/${publicationId}`;
        console.log('Submitting observation to:', url);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // Add Authorization header if needed
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ reclamation }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error ${response.status}`);
            }

            const data = await response.json();
            setSuccess(data.message || 'Observation enregistrée et réclamation rejetée.');
            setError('');
            setReclamation('');
            setTimeout(() => {
                navigate('/admin/verifier-reclamations');
            }, 2000);
        } catch (error) {
            setError(error.message || 'Erreur lors de l\'enregistrement de l\'observation');
            console.error('Submit error:', error);
            setSuccess('');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="container-fluid px-4 my-3">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb mb-2 text-light bg-light p-3 rounded shadow-sm">
                    <li className="breadcrumb-item">
                        <a href="/admin/dashboard" className="text-warning">Dashboard</a>
                    </li>
                    <li className="breadcrumb-item active text-dark">Ajouter Observation</li>
                </ol>
            </nav>

            <div className="card-body p-2">
                {success && (
                    <div className="alert alert-success text-center" role="alert">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="alert alert-danger text-center" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-4 rounded shadow border border-light">
                    <h2 className="text-center text-dark fw-lighter mb-4">Ajouter Observation</h2>
                    <div className="mb-4">
                        <label htmlFor="publication_id" className="form-label text-dark fw-lighter">
                            ID de la publication :
                        </label>
                        <input
                            type="text"
                            id="publication_id"
                            name="publication_id"
                            className="form-control border-0 border-bottom shadow-none text-dark bg-transparent"
                            value={publicationId}
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="nom_entreprise_post" className="form-label text-dark fw-lighter">
                            Nom de l'entreprise réclamée :
                        </label>
                        <input
                            type="text"
                            id="nom_entreprise_post"
                            name="nom_entreprise_post"
                            className="form-control border-0 border-bottom shadow-none text-dark bg-transparent"
                            value={nomEntreprisePost}
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="nom_entreprise_fraud" className="form-label text-dark fw-lighter">
                            Entreprise fraudeuse :
                        </label>
                        <input
                            type="text"
                            id="nom_entreprise_fraud"
                            name="nom_entreprise_fraud"
                            className="form-control border-0 border-bottom shadow-none text-dark bg-transparent"
                            value={nomEntrepriseFraud}
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="reclamation" className="form-label text-dark fw-lighter">
                            Observation :
                        </label>
                        <textarea
                            id="reclamation"
                            name="reclamation"
                            className="form-control border-0 border-bottom text-dark shadow-none bg-transparent"
                            placeholder="Écrivez votre observation ici..."
                            value={reclamation}
                            onChange={(e) => setReclamation(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button
                            type="submit"
                            className="btn btn-warning fw-lighter shadow-lg px-5 py-2"
                        >
                            Envoyer
                        </button>
                        <a
                            href="/admin/verifier-reclamations"
                            className="btn btn-secondary mx-3 fw-lighter shadow-lg px-5 py-2"
                        >
                            Annuler
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AjouterObservation;