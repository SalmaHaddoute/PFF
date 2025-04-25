import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AjouterSecteur.css';

const AjouterSecteur = () => {
    const [nom, setNom] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
        // Ici vous feriez normalement un appel API pour créer le secteur
        // Exemple avec fetch:
        // const response = await fetch('/api/secteurs', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ nom })
        // });
        
        // Simuler une réponse réussie pour la démo
        setSuccess('Secteur ajouté avec succès!');
        setError('');
        setNom('');
        
        // Redirection après 2 secondes
        setTimeout(() => {
            navigate('/admin/secteurs');
        }, 2000);
        
        } catch (error) {
        // Gérer l'erreur ici
        setError('Erreur lors de l\'ajout du secteur');
        setSuccess('');
        }
    };

    return (
        <div className="container-fluid px-4">
        <div className="page-content page-container" id="page-content">
            <div className="container-fluid px-4 my-3">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb mb-2 text-light bg-light p-3 rounded shadow-sm">
                <li className="breadcrumb-item">
                    <a href="/admin/dashboard" className="text-warning">Dashboard</a>
                </li>
                <li className="breadcrumb-item active text-dark">Ajouter Secteur</li>
                </ol>
            </nav>

            <div className="card-body p-5">
                {/* Formulaire de création de secteur */}
                <form 
                onSubmit={handleSubmit} 
                className="p-4 rounded shadow border border-light form-container"
                >
                <h2 className="text-center text-dark fw-bold mb-4">Ajouter Secteur</h2>

                {/* Nom du secteur */}
                <div className="mb-4">
                    <label htmlFor="nom" className="form-label text-dark fw-lighter">
                    Nom du Secteur :
                    </label>
                    <input
                    type="text"
                    className={`form-control border-0 border-bottom shadow-none text-dark bg-transparent ${error ? 'is-invalid' : ''}`}
                    id="nom"
                    name="nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                    />
                    
                    {error && <div className="invalid-feedback">{error}</div>}
                </div>

                {/* Messages d'erreur/succès */}
                {error && (
                    <div className="alert alert-danger mb-4">
                    {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success mb-4">
                    {success}
                    </div>
                )}

                {/* Submit Button */}
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-warning fw-lighter shadow-lg px-5 py-2">
                    Ajouter Secteur
                    </button>
                </div>
                </form>
            </div>
            </div>
        </div>
        </div>
    );
};

export default AjouterSecteur;