import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import './AjouterTechnicien.css';

const AjouterTechnicien = () => {
    const [formData, setFormData] = useState({
        cin: "",
        nom: "",
        adresse: "",
        email: "",
        telephone: "",
        id_secteur: ""
        // Removed id_entreprise from state - it will come from backend
    });
    
    const [secteurs, setSecteurs] = useState([]);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Fetch sectors from backend
    useEffect(() => {
        const fetchSecteurs = async () => {
            try {
                const response = await axios.get('/api/secteurs');
                setSecteurs(response.data.data || []);
            } catch (error) {
                setMessage({
                    text: 'Erreur lors du chargement des secteurs',
                    type: 'danger'
                });
                console.error('Error fetching secteurs:', error);
            }
        };
        fetchSecteurs();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });
        setErrors({});

        try {
            // eslint-disable-next-line no-unused-vars
            const response = await axios.post('/api/entreprise/techniciens/ajouter', formData);
            
            setMessage({
                text: 'Technicien ajouté avec succès!',
                type: 'success'
            });
            
            // Reset form on success
            setFormData({
                cin: "",
                nom: "",
                adresse: "",
                email: "",
                telephone: "",
                id_secteur: ""
            });
            
        } catch (error) {
            if (error.response?.data?.errors) {
                // Backend validation errors
                setErrors(error.response.data.errors);
            } else {
                setMessage({
                    text: error.response?.data?.message || 'Erreur lors de l\'ajout du technicien',
                    type: 'danger'
                });
            }
            console.error('Error adding technicien:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <div className="container-fluid px-4 my-3">
                <ol className="breadcrumb mb-4 text-light p-3 rounded shadow-sm">
                    <li className="breadcrumb-item">
                        <a href="#" className="text-warning">Dashboard</a>
                    </li>
                    <li className="breadcrumb-item active text-light-dark">
                        Ajouter Technicien
                    </li>
                </ol>

                <div className="container">
                    {message.text && (
                        <div className={`alert text-center mb-4 alert-${message.type}`}>
                            {message.text}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="p-4 rounded shadow border border-light bg-white">
                        <h2 className="text-center">Ajouter un Technicien</h2>
                        
                        {/* CIN Field */}
                        <div className="mb-3">
                            <label htmlFor="cin" className="form-label">CIN :</label>
                            <input
                                type="text"
                                className={`form-control ${errors.cin ? 'is-invalid' : ''}`}
                                id="cin"
                                name="cin"
                                value={formData.cin}
                                onChange={handleChange}
                                required
                            />
                            {errors.cin && <div className="invalid-feedback">{errors.cin}</div>}
                        </div>
                        
                        {/* Nom Field */}
                        <div className="mb-3">
                            <label htmlFor="nom" className="form-label">Nom :</label>
                            <input
                                type="text"
                                className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
                                id="nom"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                            />
                            {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
                        </div>
                        
                        {/* Adresse Field */}
                        <div className="mb-3">
                            <label htmlFor="adresse" className="form-label">Adresse :</label>
                            <input
                                type="text"
                                className={`form-control ${errors.adresse ? 'is-invalid' : ''}`}
                                id="adresse"
                                name="adresse"
                                value={formData.adresse}
                                onChange={handleChange}
                                required
                            />
                            {errors.adresse && <div className="invalid-feedback">{errors.adresse}</div>}
                        </div>
                        
                        {/* Email Field */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email :</label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        
                        {/* Telephone Field */}
                        <div className="mb-3">
                            <label htmlFor="telephone" className="form-label">Téléphone :</label>
                            <input
                                type="text"
                                className={`form-control ${errors.telephone ? 'is-invalid' : ''}`}
                                id="telephone"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                required
                            />
                            {errors.telephone && <div className="invalid-feedback">{errors.telephone}</div>}
                        </div>
                        
                        {/* Secteur Field */}
                        <div className="mb-3">
                            <label htmlFor="id_secteur" className="form-label">Secteur :</label>
                            <select
                                className={`form-control ${errors.id_secteur ? 'is-invalid' : ''}`}
                                id="id_secteur"
                                name="id_secteur"
                                value={formData.id_secteur}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Sélectionnez un secteur</option>
                                {secteurs.map((secteur) => (
                                    <option key={secteur.id} value={secteur.id}>
                                        {secteur.nom}
                                    </option>
                                ))}
                            </select>
                            {errors.id_secteur && <div className="invalid-feedback">{errors.id_secteur}</div>}
                        </div>
                        
                        <div className="d-flex justify-content-center">
                            <button 
                                type="submit" 
                                className="btn btn-warning fw-lighter shadow-lg px-5 py-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        En cours...
                                    </>
                                ) : (
                                    "Ajouter Technicien"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default AjouterTechnicien;