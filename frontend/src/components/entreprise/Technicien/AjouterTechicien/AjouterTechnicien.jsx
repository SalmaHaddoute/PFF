import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AjouterTechnicien.css';
import { useAuth } from '../../../../context/AuthContext';

const AjouterTechnicien = () => {
    const API_BASE_URL = 'http://localhost:8000/api';
    // Utiliser le contexte d'authentification pour récupérer l'ID de l'entreprise connectée
    const { user, token } = useAuth();
    
    const [formData, setFormData] = useState({
        cin: "",
        nom: "",
        adresse: "",
        email: "",
        telephone: "",
        id_secteur: "",
        id_entreprise: ""
    });
    
    const [secteurs, setSecteurs] = useState([]);
    const [loadingSecteurs, setLoadingSecteurs] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    // Effet pour mettre à jour l'ID de l'entreprise lorsque l'utilisateur est chargé
    useEffect(() => {
        if (user && user.id) {
            setFormData(prev => ({
                ...prev,
                id_entreprise: user.id
            }));
            console.log("ID de l'entreprise connectée défini:", user.id);
        }
    }, [user]);

    useEffect(() => {
        const fetchSecteurs = async () => {
            try {
                setLoadingSecteurs(true);
                const response = await axios.get(`${API_BASE_URL}/secteurs`);
                
                if (response.data && Array.isArray(response.data)) {
                    setSecteurs(response.data);
                } else {
                    console.error("Format de données inattendu:", response.data);
                    setMessage("Erreur de format des secteurs");
                    setMessageType("danger");
                }
            } catch (error) {
                console.error("Erreur API:", error);
                setMessage("Erreur lors du chargement des secteurs");
                setMessageType("danger");
            } finally {
                setLoadingSecteurs(false);
            }
        };
        
        fetchSecteurs();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            await axios.post(
                `${API_BASE_URL}/entreprise/techniciens`,
                formData,
                config
            );

            setMessage("Technicien ajouté avec succès !");
            setMessageType("success");
            
            setFormData({
                cin: "",
                nom: "",
                adresse: "",
                email: "",
                telephone: "",
                id_secteur: "",
                id_entreprise: user?.id || ""
            });

        } catch (error) {
            console.error("Erreur:", error.response?.data || error.message);
            
            const errorMessage = error.response?.data?.message 
                || "Erreur lors de l'ajout du technicien";
            
            setMessage(errorMessage);
            setMessageType("danger");
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
                    {message && (
                        <div className={`alert alert-${messageType} text-center mb-4`}>
                            {message}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="p-4 rounded shadow border border-light bg-white">
                        <h2 className="text-center mb-4">Ajouter un Technicien</h2>
                        
                        <div className="mb-3">
                            <label htmlFor="cin" className="form-label">CIN :</label>
                            <input
                                type="text"
                                className="form-control text-dark"
                                id="cin"
                                name="cin"
                                value={formData.cin}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="nom" className="form-label">Nom :</label>
                            <input
                                type="text"
                                className="form-control text-dark"
                                id="nom"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="adresse" className="form-label">Adresse :</label>
                            <input
                                type="text"
                                className="form-control text-dark"
                                id="adresse"
                                name="adresse"
                                value={formData.adresse}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email :</label>
                            <input
                                type="email"
                                className="form-control text-dark"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="telephone" className="form-label">Téléphone :</label>
                            <input
                                type="text"
                                className="form-control text-dark"
                                id="telephone"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="id_secteur" className="form-label">Secteur :</label>
                            {loadingSecteurs ? (
                                <div className="text-center">Chargement des secteurs...</div>
                            ) : (
                                <select
                                    className="form-control text-dark"
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
                            )}
                        </div>
                        
                        
                        <div className="d-flex justify-content-center mt-4">
                            <button type="submit" className="btn btn-warning fw-lighter shadow-lg px-5 py-2">
                                Ajouter Technicien
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default AjouterTechnicien;