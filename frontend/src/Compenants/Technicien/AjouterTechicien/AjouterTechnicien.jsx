import React, { useState } from 'react';
import './AjouterTechnicien.css';

// Default data simulating database query
const defaultSecteurs = [
    { id: 1, nom: "Informatique" },
    { id: 2, nom: "Électronique" },
    { id: 3, nom: "Mécanique" },
];

// Simulated logged-in user and enterprise ID
// eslint-disable-next-line no-unused-vars
const loggedInUser = {
    user_id: 1,
    username: "Example Company",
    user_type: "entreprise",
};
// eslint-disable-next-line no-unused-vars
const idEntreprise = 1;

const AjouterTechnicien = () => {
    const [formData, setFormData] = useState({
        cin: "",
        nom_technicien: "",
        adresse: "",
        email: "",
        telephone: "",
        id_secteur: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { cin, nom_technicien, adresse, email, telephone, id_secteur } = formData;

        // Client-side validation
        if (!cin || !nom_technicien || !adresse || !email || !telephone || !id_secteur) {
            setMessage("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        // Simulate database checks
        const existingTechnicien = false; // Simulate check for existing CIN or email
        if (existingTechnicien) {
            setMessage("Un technicien avec ce CIN ou cet email existe déjà.");
            return;
        }

        const entrepriseExists = true; // Simulate check for enterprise ID
        if (!entrepriseExists) {
            setMessage("L'entreprise spécifiée n'existe pas.");
            return;
        }

        const secteurExists = defaultSecteurs.some((secteur) => secteur.id === parseInt(id_secteur));
        if (!secteurExists) {
            setMessage("Le secteur spécifié n'existe pas.");
            return;
        }

        // Simulate successful submission
        setMessage("Technicien ajouté avec succès !");
        setFormData({
            cin: "",
            nom_technicien: "",
            adresse: "",
            email: "",
            telephone: "",
            id_secteur: "",
        });
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
                                    <div className={`alert text-center mb-4 ${message.includes('succès') ? 'alert-success' : 'alert-danger'}`}>
                                        {message}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit} className="p-4 rounded shadow border border-light  bg-white">
                                    <h2 className="text-center">Ajouter un Technicien</h2>
                                    <div className="mb-3">
                                        <label htmlFor="cin" className="form-label">CIN :</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="cin"
                                            name="cin"
                                            value={formData.cin}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="nom_technicien" className="form-label">Nom :</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nom_technicien"
                                            name="nom_technicien"
                                            value={formData.nom_technicien}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="adresse" className="form-label">Adresse :</label>
                                        <input
                                            type="text"
                                            className="form-control"
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
                                            className="form-control"
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
                                            className="form-control"
                                            id="telephone"
                                            name="telephone"
                                            value={formData.telephone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="id_secteur" className="form-label">Secteur :</label>
                                        <select
                                            className="form-control"
                                            id="id_secteur"
                                            name="id_secteur"
                                            value={formData.id_secteur}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Sélectionnez un secteur</option>
                                            {defaultSecteurs.map((secteur) => (
                                                <option key={secteur.id} value={secteur.id}>
                                                    {secteur.nom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="d-flex justify-content-center">
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