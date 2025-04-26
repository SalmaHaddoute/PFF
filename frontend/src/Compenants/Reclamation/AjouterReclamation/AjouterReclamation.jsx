/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './AjouterReclamation.css';

const AjouterReclamation = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    nom_entreprise_fraud: '',
    raison: '',
    preuve_file: null,
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 1. Vérifier d'abord le localStorage
        const storedUser = localStorage.getItem('user_data');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // 2. Si l'utilisateur n'est pas une entreprise, rediriger
          if (!parsedUser || parsedUser.role !== 'entreprise') {
            navigate('/signup');
            return;
          }

          // 3. Si des données manquent, faire une requête API
          if (!parsedUser.rc || !parsedUser.ice) {
            const response = await api.get('/api/entreprise/profile', {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            setCurrentUser(response.data);
          } else {
            setCurrentUser(parsedUser);
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur", error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, preuve_file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { nom_entreprise_fraud, raison, preuve_file } = formData;

    if (!nom_entreprise_fraud || !raison || !preuve_file) {
      setMessage('Veuillez remplir tous les champs obligatoires.');
      setMessageType('danger');
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('id_entreprise', currentUser.id);
      formDataToSend.append('rc', currentUser.rc);
      formDataToSend.append('ice', currentUser.ice);
      formDataToSend.append('nom_entreprise_post', currentUser.username ?? '');
      formDataToSend.append('nom_entreprise_fraud', nom_entreprise_fraud);
      formDataToSend.append('raison', raison);
      formDataToSend.append('preuve_file', preuve_file);

      // Récupérer le cookie CSRF
      await api.get('/sanctum/csrf-cookie');

      // Envoyer la réclamation
      const response = await api.post('/api/entreprise/reclamations/ajouter', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      });

      setMessage('Réclamation créée avec succès!');
      setMessageType('success');

      setFormData({
        nom_entreprise_fraud: '',
        raison: '',
        preuve_file: null,
      });

      // Rediriger après 2 secondes
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage(error.response?.data?.message || 
                error.message || 
                'Erreur lors de la création de la réclamation.');
      setMessageType('danger');
    } finally {
      setIsSubmitting(false);
    }
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
            
            {/* Champ RC */}
            <div className="mb-4">
              <label htmlFor="rc" className="form-label text-light-dark fw-lighter">
                RC :
              </label>
              <input
                type="text"
                className="form-control border-0 border-bottom shadow-none bg-transparent"
                id="rc"
                name="rc"
                value={currentUser?.rc || 'Chargement...'}
                readOnly
                required
              />
            </div>
            
            {/* Champ ICE */}
            <div className="mb-4">
              <label htmlFor="ice" className="form-label text-light-dark fw-lighter">
                ICE :
              </label>
              <input
                type="text"
                className="form-control border-0 border-bottom shadow-none bg-transparent"
                id="ice"
                name="ice"
                value={currentUser?.ice || 'Chargement...'}
                readOnly
                required
              />
            </div>
            
            {/* Champ Nom de l'entreprise */}
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
                value={currentUser?.username ?? ''}
                readOnly
                required
              />
            </div>

            {/* Champ Entreprise frauduleuse */}
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

            {/* Champ Raison */}
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

            {/* Champ Preuve */}
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

            {/* Bouton de soumission */}
            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-warning fw-lighter shadow-lg px-5 py-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Créer Réclamation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AjouterReclamation;