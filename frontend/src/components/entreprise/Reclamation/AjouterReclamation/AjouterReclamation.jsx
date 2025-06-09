import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './AjouterReclamation.css';
import axios from 'axios';
import { useAuth } from '../../../../context/AuthContext';

const AjouterReclamation = () => {
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:8000/api';
  const { user, token } = useAuth(); // Récupération des données de l'entreprise connectée
  
  // État local pour stocker les données de l'entreprise
  const [entrepriseData, setEntrepriseData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Récupérer les données de l'entreprise à partir du contexte d'authentification
  useEffect(() => {
    if (user) {
      setEntrepriseData({
        id: user.id,
        username: user.username || user.name, // Utiliser username ou name selon le modèle
        rc: user.rc || '',
        ice: user.ice || '',
        email: user.email || ''
      });
      setLoading(false);
    }
  }, [user]);

  // State for form data
  const [formData, setFormData] = useState({
    nom_entreprise_fraud: '',
    raison: '',
    preuve_file: null,
  });

  // State for alert messages
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, preuve_file: e.target.files[0] }));
  };

  // Format date to MySQL-compatible format (YYYY-MM-DD HH:MM:SS)
  const formatMySQLDate = (date) => {
    const pad = (num) => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nom_entreprise_fraud, raison, preuve_file } = formData;

    if (!nom_entreprise_fraud || !raison || !preuve_file) {
      setMessage('Veuillez remplir tous les champs obligatoires.');
      setMessageType('danger');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('id_entreprise', entrepriseData.id);
      formDataToSend.append('rc', entrepriseData.rc);
      formDataToSend.append('ice', entrepriseData.ice);
      formDataToSend.append('nom_entreprise_post', entrepriseData.username);
      formDataToSend.append('nom_entreprise_fraud', nom_entreprise_fraud);
      formDataToSend.append('raison', raison);
      formDataToSend.append('preuve_file', preuve_file);
      formDataToSend.append('post_date', formatMySQLDate(new Date())); // Use MySQL-compatible format

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}` // Ajout du token d'authentification
        },
      };

      const response = await axios.post(
        `${API_BASE_URL}/entreprise/reclamations`,
        formDataToSend,
        config
      );

      if (response.data.success) {
        setMessage('Réclamation créée avec succès!');
        setMessageType('success');
        setFormData({
          nom_entreprise_fraud: '',
          raison: '',
          preuve_file: null,
        });

        setTimeout(() => {
          navigate('/entreprise/reclamations/listsreclamation');
        }, 2000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erreur lors de la création de la réclamation';
      setMessage(errorMessage);
      setMessageType('danger');
      console.error('Erreur:', error.response?.data || error.message);
    }
  };

  // Afficher un message de chargement pendant que les données sont récupérées
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-3">Chargement des données de l'entreprise...</p>
      </div>
    );
  }

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
                value={user.rc || ''}
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
                value={user.ice || ''}
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
                value={user.username || ''}
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
                className="form-control border-0 border-bottom shadow-none bg-transparent"
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