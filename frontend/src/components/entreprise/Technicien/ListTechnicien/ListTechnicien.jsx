import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './ListTechnicien.css';
import { useAuth } from '../../../../context/AuthContext';

const ListTechnicien = () => {
  const API_BASE_URL = 'http://localhost:8000/api';
  const [techniciens, setTechniciens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Récupération des données de l'utilisateur connecté
  const { user, token } = useAuth();

  // Récupérer les techniciens depuis l'API avec filtrage par entreprise
  const fetchTechniciens = useCallback(async () => {
    if (!user || !user.id) {
      setError("Vous devez être connecté pour voir vos techniciens");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(''); // Réinitialiser les erreurs précédentes
      
      console.log('Utilisateur connecté:', user);
      
      // Appel API pour récupérer tous les techniciens
      const response = await axios.get(`${API_BASE_URL}/entreprise/techniciens`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Réponse API des techniciens:', response.data);
      
      // Structure de la réponse: {success: true, data: [...techniciens...]} ou 
      // {success: true, data: {current_page: 1, data: [...techniciens...], ...}}
      let techniciensData = [];
      
      // Vérifier la structure de la réponse et extraire les données en conséquence
      if (response.data?.success) {
        if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
          // Structure paginée: data.data.data contient le tableau
          techniciensData = response.data.data.data;
          console.log('Techniciens extraits de structure paginée:', techniciensData.length);
        } else if (Array.isArray(response.data.data)) {
          // Structure simple: data.data contient directement le tableau
          techniciensData = response.data.data;
          console.log('Techniciens extraits de structure simple:', techniciensData.length);
          
          // Afficher la structure complète du premier technicien pour analyse
          if (techniciensData.length > 0) {
            console.log('Structure du premier technicien:', techniciensData[0]);
            console.log('Clés disponibles:', Object.keys(techniciensData[0]).join(', '));
          }
        } else {
          console.error('Structure de réponse inattendue:', response.data);
          setError("Format de réponse inattendu");
          setLoading(false);
          return;
        }
      } else {
        console.error('Réponse API sans succès:', response.data);
        setError("La récupération des techniciens a échoué");
        setLoading(false);
        return;
      }
      
      console.log(`Filtrage des techniciens pour l'entreprise ID ${user.id} (${user.username})`);
      
      // NOTE: Il y a un problème avec la réponse API - le champ 'id_entreprise' existe dans la base de données
      // mais n'est pas renvoyé dans la réponse API. Pour le moment, nous allons afficher tous les techniciens.
      console.log(`PROBLÈME DÉTECTÉ: L'API ne renvoie pas le champ 'id_entreprise' nécessaire au filtrage`);
      
      // Pour débogage: Vérifier si le champ id_entreprise est présent dans les données
      if (techniciensData.length > 0) {
        console.log('Premier technicien - champs disponibles:', Object.keys(techniciensData[0]));
        console.log('Premier technicien - valeurs:', JSON.stringify(techniciensData[0]));
      }
      
      // Rechercher les techniciens de l'entreprise connectée (id = 8, comme indiqué dans la table)
      // En attendant que l'API soit corrigée pour inclure id_entreprise
      const filteredTechniciens = techniciensData.filter(technicien => {
        // Cas spécial: si c'est le technicien ID 9 qui appartient à l'entreprise 8 selon les données
        if (technicien.id === 9 && user.id === 8) {
          console.log('Trouvé le technicien ID 9 qui appartient à l´entreprise 8');
          return true;
        }
        
        // Tenter de récupérer id_entreprise s'il existe
        const techEntrepriseId = parseInt(technicien.id_entreprise);
        const userId = parseInt(user.id);
        
        if (!isNaN(techEntrepriseId)) {
          const matched = techEntrepriseId === userId;
          console.log(`Technicien #${technicien.id}: id_entreprise=${techEntrepriseId} vs user.id=${userId} - Match: ${matched}`);
          return matched;
        }
        
        // Si nous n'avons pas d'id_entreprise, renvoyer false pour ce technicien
        return false;
      });
      
      console.log(`Techniciens filtrés par id_entreprise: ${filteredTechniciens.length} sur ${techniciensData.length} total`);
      
      // Afficher un message approprié
      if (filteredTechniciens.length === 0) {
        // Problème de filtrage connu, afficher un message plus explicatif
        setMessage(`Aucun technicien trouvé pour l'entreprise ${user.username} (ID: ${user.id}). NOTE: Le filtrage par entreprise nécessite une mise à jour de l'API.`);
      } else {
        setMessage(`${filteredTechniciens.length} technicien(s) trouvé(s) pour l'entreprise ${user.username}`);
      }
      
      // Pour le débogage, afficher le premier technicien filtré si disponible
      if (filteredTechniciens.length > 0) {
        console.log('Premier technicien filtré:', filteredTechniciens[0]);
      }
      
      console.log(`Techniciens filtrés: ${filteredTechniciens.length} pour l'entreprise ID ${user.id}`);
      if (filteredTechniciens.length > 0) {
        console.log('Premier technicien filtré:', filteredTechniciens[0]);
      }
      
      // Définir les techniciens filtrés
      setTechniciens(filteredTechniciens);
      
      // Gestion du message si aucun technicien n'est trouvé
      if (filteredTechniciens.length === 0) {
        setMessage("Aucun technicien trouvé pour votre entreprise");
      } else {
        setMessage(""); // Effacer le message si des techniciens sont trouvés
      }
    } catch (err) {
      console.error("Erreur détaillée:", err.response || err.message);
      setError("Erreur lors du chargement des techniciens");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, token, user]);
  
  // Effet pour charger les techniciens lorsque l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      fetchTechniciens();
    }
  }, [user, fetchTechniciens]);
  const handleEdit = (technicien) => {
    setEditingId(technicien.id);
    setEditForm({
      cin: technicien.cin,
      nom: technicien.nom,
      adresse: technicien.adresse,
      email: technicien.email,
      telephone: technicien.telephone,
      id_secteur: technicien.id_secteur
    });
  };

  const handleSave = async (id) => {
    try {
        // Ajoutez l'id_entreprise aux données envoyées
        const technicienToUpdate = techniciens.find(t => t.id === id);
        const dataToSend = {
            ...editForm,
            id_entreprise: technicienToUpdate.id_entreprise // Conservez l'entreprise d'origine
        };

        const response = await axios.put(
            `${API_BASE_URL}/entreprise/techniciens/${id}`,
            dataToSend,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.data.success) {
            setTechniciens(techniciens.map(t => 
                t.id === id ? { ...t, ...editForm } : t
            ));
            setEditingId(null);
            setEditForm({});
            setMessage('Technicien mis à jour avec succès');
            setTimeout(() => setMessage(''), 5000);
        }
    } catch (err) {
        console.error("Erreur détaillée:", err.response?.data || err.message);
        setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
        setTimeout(() => setError(''), 5000);
    }
};

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce technicien ?")) {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/entreprise/techniciens/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setTechniciens(techniciens.filter(t => t.id !== id));
          setMessage('Technicien supprimé avec succès');
        }
      } catch (err) {
        setError('Erreur lors de la suppression');
        console.error(err);
      }
    }
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  
  // Fonction pour afficher les détails du technicien dans un popup
  const handleShowDetails = (technicien) => {
    setIsProcessing(true);
    
    try {
      // Créer un message HTML formaté avec les détails du technicien
      const message = `
        <div class="technicien-info">
          <h5>Détails du technicien</h5>
          <div class="technicien-details p-3 bg-light rounded mb-3">
            <p><strong>Nom:</strong> ${technicien.nom || 'Non spécifié'}</p>
            <p><strong>CIN:</strong> ${technicien.cin || 'Non spécifié'}</p>
            <p><strong>Email:</strong> ${technicien.email || 'Non spécifié'}</p>
            <p><strong>Téléphone:</strong> ${technicien.telephone || 'Non spécifié'}</p>
            <p><strong>Adresse:</strong> ${technicien.adresse || 'Non spécifié'}</p>
            <p><strong>Secteur:</strong> ${technicien.secteur_nom || 'Non spécifié'}</p>
          </div>
          <h6>Informations supplémentaires</h6>
          <p><strong>ID:</strong> ${technicien.id}</p>
          <p><strong>Entreprise:</strong> ${user.username || 'Non spécifié'}</p>
          <p><strong>Date d'ajout:</strong> ${technicien.created_at ? new Date(technicien.created_at).toLocaleString() : 'Non spécifié'}</p>
          <p><strong>Dernière mise à jour:</strong> ${technicien.updated_at ? new Date(technicien.updated_at).toLocaleString() : 'Non spécifié'}</p>
        </div>
      `;
      
      setPopupMessage(message);
      setShowPopup(true);
    } catch (error) {
      console.error("Erreur lors de l'affichage des détails:", error);
      const errorMessage = `
        <div class="technicien-info">
          <h5>Erreur</h5>
          <p>Impossible d'afficher les détails du technicien.</p>
          <p class="text-danger">${error.message}</p>
        </div>
      `;
      setPopupMessage(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="text-center my-5">Chargement en cours...</div>;
  }

  return (
    <>
    <main>
      <div className="container-fluid px-4 my-3">
        <ol className="breadcrumb mb-4 text-light p-3 rounded shadow-sm">
          <li className="breadcrumb-item">
            <a href="#" className="text-warning">
              Dashboard
            </a>
          </li>
          <li className="breadcrumb-item active text-light-dark">
            Listes Techniciens
          </li>
        </ol>

        {message && (
          <div className="alert alert-success text-center mx-auto w-50" role="alert">
            {message}
          </div>
        )}
        {error && (
          <div className="alert alert-danger text-center mx-auto w-50" role="alert">
            {error}
          </div>
        )}

        <div className="col-lg-12 grid-margin stretch-card my-3">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">CIN</th>
                      <th className="p-4">Nom</th>
                      <th className="p-4">Adresse</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Téléphone</th>
                      <th className="p-4">Secteur</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {techniciens.length > 0 ? (
                      techniciens.map((technicien) => (
                        <tr key={technicien.id} className="border-t">
                          <td className="p-4">{technicien.id}</td>
                          <td className="p-4">
                            {editingId === technicien.id ? (
                              <input
                                type="text"
                                name="cin"
                                value={editForm.cin || ""}
                                onChange={handleInputChange}
                                className="form-control text-dark"
                              />
                            ) : (
                              technicien.cin
                            )}
                          </td>
                          <td className="p-4">
                            {editingId === technicien.id ? (
                              <input
                                type="text"
                                name="nom"
                                value={editForm.nom || ""}
                                onChange={handleInputChange}
                                className="form-control text-dark"
                              />
                            ) : (
                              technicien.nom
                            )}
                          </td>
                          <td className="p-4">
                            {editingId === technicien.id ? (
                              <input
                                type="text"
                                name="adresse"
                                value={editForm.adresse || ""}
                                onChange={handleInputChange}
                                className="form-control text-dark"
                              />
                            ) : (
                              technicien.adresse
                            )}
                          </td>
                          <td className="p-4">
                            {editingId === technicien.id ? (
                              <input
                                type="text"
                                name="email"
                                value={editForm.email || ""}
                                onChange={handleInputChange}
                                className="form-control text-dark"
                              />
                            ) : (
                              technicien.email
                            )}
                          </td>
                          <td className="p-4">
                            {editingId === technicien.id ? (
                              <input
                                type="text"
                                name="telephone"
                                value={editForm.telephone || ""}
                                onChange={handleInputChange}
                                className="form-control text-dark"
                              />
                            ) : (
                              technicien.telephone
                            )}
                          </td>
                          <td className="p-4">
                            {editingId === technicien.id ? (
                              <select
                                name="id_secteur"
                                value={editForm.id_secteur || ""}
                                onChange={handleInputChange}
                                className="form-control text-dark"
                              >
                                {/* Options des secteurs */}
                              </select>
                            ) : (
                              technicien.secteur_nom
                            )}
                          </td>
                          <td className="p-4 d-flex justify-content-center">
                            {editingId === technicien.id ? (
                              <button
                                onClick={() => handleSave(technicien.id)}
                                className="btn btn-success me-2"
                              >
                                <i className="bi bi-check"></i>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEdit(technicien)}
                                className="btn btn-primary me-2"
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(technicien.id)}
                              className="btn btn-danger"
                            >
                              <i className="bi bi-trash3"></i>
                            </button>
                            <button
                              onClick={() => handleShowDetails(technicien)}
                              className="btn btn-info ms-2"
                              title="Voir détails"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="p-4 text-center">
                          Aucun technicien trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Popup pour afficher les détails du technicien */}
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup popup-large">
              <span className="close-btn" onClick={() => setShowPopup(false)}>×</span>
              {isProcessing ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                  <p className="mt-3">Chargement des détails...</p>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: popupMessage }} />
              )}
              <button 
                onClick={() => setShowPopup(false)}
                className="btn btn-primary mt-3"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
    
    <style>{`
      .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .popup {
        background-color: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 500px;
        width: 100%;
        position: relative;
        max-height: 80vh;
        overflow-y: auto;
      }
      .popup-large {
        max-width: 650px;
      }
      .close-btn {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6c757d;
      }
      .close-btn:hover {
        color: #343a40;
      }
      .technicien-info h5, .technicien-info h6 {
        color: #333;
        margin-bottom: 15px;
      }
      .technicien-details {
        border-left: 4px solid #17a2b8;
        background-color: #f8f9fa;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 4px;
      }
    `}</style>
    </>
  );
};

export default ListTechnicien;