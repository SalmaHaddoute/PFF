/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './AjouterReclamation.css'; // Fichier CSS séparé pour les styles personnalisés

const AjouterReclamation = () => {
  const navigate = useNavigate();

  // Données par défaut simulant une session utilisateur
  const [user, setUser] = useState({
    id: 1,
    username: 'Entreprise ABC',
    rc: '123456789',
    ice: '987654321',
    userType: 'entreprise',
  });

  // État pour le formulaire
  const [formData, setFormData] = useState({
    nom_entreprise_fraud: '',
    raison: '',
    preuve_file: null,
  });

  // État pour les messages d'alerte
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Vérifier si l'utilisateur est connecté et est une entreprise
  useEffect(() => {
    if (!user.id || user.userType !== 'entreprise') {
      navigate('/signup');
    }
  }, [user, navigate]);

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gérer le changement de fichier
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, preuve_file: e.target.files[0] }));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nom_entreprise_fraud, raison, preuve_file } = formData;

    // Vérifier que tous les champs obligatoires sont remplis
    if (!nom_entreprise_fraud || !raison || !preuve_file) {
      setMessage('Veuillez remplir tous les champs obligatoires.');
      setMessageType('danger');
      return;
    }

    // Simuler l'envoi des données au serveur
    try {
      // Créer un FormData pour simuler l'envoi de fichiers
      const formDataToSend = new FormData();
      formDataToSend.append('id_entreprise', user.id);
      formDataToSend.append('rc', user.rc);
      formDataToSend.append('ice', user.ice);
      formDataToSend.append('nom_entreprise_post', user.username);
      formDataToSend.append('nom_entreprise_fraud', nom_entreprise_fraud);
      formDataToSend.append('raison', raison);
      formDataToSend.append('preuve_file', preuve_file);
      formDataToSend.append('status', 'en attente');

      // Simuler une requête API (remplacez ceci par une vraie requête API)
      console.log('Envoi des données:', {
        id_entreprise: user.id,
        rc: user.rc,
        ice: user.ice,
        nom_entreprise_post: user.username,
        nom_entreprise_fraud,
        raison,
        preuve_file: preuve_file.name,
        status: 'en attente',
      });

      // Simuler une réponse réussie
      setMessage('Réclamation créée avec succès!');
      setMessageType('success');

      // Réinitialiser le formulaire
      setFormData({
        nom_entreprise_fraud: '',
        raison: '',
        preuve_file: null,
      });
    } catch (error) {
      setMessage('Erreur lors de la création de la réclamation.');
      setMessageType('danger');
    }
  };

  // Gérer la déconnexion
  const handleLogout = () => {
    // Simuler la déconnexion
    setUser({});
    navigate('/logout');
  };

  return (
          <main>
            <div className="container-fluid px-4">
              <ol className="breadcrumb text-light p-3 rounded shadow-sm">
                <li className="breadcrumb-item">
                  <a href="/dashboard" className="text-warning">
                    Dashboard
                  </a>
                </li>
                <li className="breadcrumb-item active text-light-dark">Ajouter une réclamation</li>
              </ol>

              <div className="card-body">
                {message && (
                  <div className={`alert alert-${messageType}`}>{message}</div>
                )}
                <form
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                  className="p-4 rounded shadow border border-light"
                  style={{ background: 'transparent' }}
                >
                  <h2 className="mb-2 text-dark text-center fw-lighter">
                    Créer une Réclamation
                  </h2>
                  <div className="mb-4">
                    <label htmlFor="rc" className="form-label text-light-dark fw-lighter">
                      RC :
                    </label>
                    <input
                      type="text"
                      className="form-control border-0 border-bottom shadow-none bg-transparent"
                      id="rc"
                      name="rc"
                      value={user.rc}
                      readOnly
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="ice" className="form-label text-light-dark fw-lighter">
                      ICE :
                    </label>
                    <input
                      type="text"
                      className="form-control border-0 border-bottom shadow-none bg-transparent"
                      id="ice"
                      name="ice"
                      value={user.ice}
                      readOnly
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="nom_entreprise_post"
                      className="form-label text-light-dark fw-lighter"
                    >
                      Nom de votre entreprise :
                    </label>
                    <input
                      type="text"
                      className="form-control border-0 border-bottom shadow-none bg-transparent"
                      id="nom_entreprise_post"
                      name="nom_entreprise_post"
                      value={user.username}
                      readOnly
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="nom_entreprise_fraud"
                      className="form-label text-light-dark fw-lighter"
                    >
                      Nom de l'entreprise frauduleuse :
                    </label>
                    <input
                      type="text"
                      className="form-control border-0 border-bottom shadow-none bg-transparent"
                      id="nom_entreprise_fraud"
                      name="nom_entreprise_fraud"
                      value={formData.nom_entreprise_fraud}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="raison" className="form-label text-light-dark fw-lighter">
                      Raison :
                    </label>
                    <textarea
                      className="form-control border-0 border-bottom shadow-none tornare bg-transparent"
                      id="raison"
                      name="raison"
                      rows="2"
                      value={formData.raison}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="preuve_file"
                      className="form-label text-light-dark fw-lighter"
                    >
                      Preuve (obligatoire) :
                    </label>
                    <input
                      type="file"
                      className="form-control border-0 border-bottom shadow-none bg-transparent fw-lighter"
                      id="preuve_file"
                      name="preuve_file"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-center">
                    <button
                      type="submit"
                      className="btn btn-warning fw-lighter shadow-lg px-5 py-2"
                    >
                      Créer Réclamation
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
          
  );
};

export default AjouterReclamation;