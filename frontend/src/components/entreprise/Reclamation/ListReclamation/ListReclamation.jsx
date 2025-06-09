import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ListReclamation.css';
import { useAuth } from '../../../../context/AuthContext';

const ListReclamation = () => {
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:8000/api';
  const { user, token } = useAuth(); // RÃ©cupÃ©ration des donnÃ©es de l'entreprise connectÃ©e
  
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Récupérer les réclamations depuis l'API avec filtrage par entreprise
  useEffect(() => {
    const fetchReclamations = async () => {
      if (!user || !user.id) {
        setError("Vous devez être connecté pour voir vos réclamations");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(''); // Réinitialiser les erreurs précédentes
        
        console.log('Utilisateur connecté:', user);
        
        // Appel API pour récupérer les réclamations
        const response = await axios.get(`${API_BASE_URL}/entreprise/reclamations`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Réponse API des réclamations:', response.data);
        
        // Structure de la réponse identifiée: {success: true, data: {current_page: 1, data: [...réclamations...], ...}}
        let reclamationsData = [];
        
        // Accès direct au tableau de réclamations qui se trouve dans response.data.data.data
        if (response.data?.success && response.data?.data?.data && Array.isArray(response.data.data.data)) {
          reclamationsData = response.data.data.data;
          console.log('Réclamations extraites avec succès:', reclamationsData.length);
        } else {
          console.error('Structure de réponse inattendue');
        }
        
        // Filtrer les réclamations pour n'afficher que celles de l'entreprise connectée
        const filteredReclamations = reclamationsData.filter(reclamation => {
          // Convertir les IDs en nombre pour une comparaison fiable
          const recId = parseInt(reclamation.id_entreprise);
          const userId = parseInt(user.id);
          
          // Vérifier si cette réclamation appartient à l'entreprise connectée
          console.log(`Vérification réclamation #${reclamation.id}: id_entreprise=${recId} vs user.id=${userId}`);
          return recId === userId;
        });
        
        console.log(`Réclamations filtrées: ${filteredReclamations.length} pour l'entreprise ID ${user.id}`);
        if (filteredReclamations.length > 0) {
          console.log('Première réclamation filtrée:', filteredReclamations[0]);
        }
        
        console.log('Réclamations filtrées par entreprise:', filteredReclamations);
        console.log('Entreprise connectée:', user.username, 'ID:', user.id);
        
        // Définir les réclamations filtrées
        setReclamations(filteredReclamations);
        
        // Gestion de la pagination avec les métadonnées correctes
        if (response.data?.data?.last_page) {
          setTotalPages(response.data.data.last_page);
          setCurrentPage(response.data.data.current_page);
        } else {
          setTotalPages(1);
        }
        
        if (filteredReclamations.length === 0) {
          setMessage("Aucune réclamation trouvée pour votre entreprise");
        }
      } catch (err) {
        setError("Erreur lors du chargement des réclamations");
        console.error("Erreur:", err);
        setReclamations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReclamations();
  }, [user, token, API_BASE_URL, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    if (window.confirm('ÃŠtes-vous sÃ»r de vouloir supprimer cette rÃ©clamation ?')) {
      try {
        await axios.delete(`${API_BASE_URL}/entreprise/reclamations/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setReclamations(reclamations.filter(reclamation => reclamation.id !== id));
        setMessage('RÃ©clamation supprimÃ©e avec succÃ¨s');
      } catch (err) {
        setError('Erreur lors de la suppression');
        console.error(err);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/entreprise/reclamations/edit/${id}`);
  };

  return (
    <div className="container-fluid px-4 my-3">
      <ol className="breadcrumb mb-2 text-light p-3 rounded shadow-sm">
        <li className="breadcrumb-item">
          <a href="/entreprise" className="text-warning">Dashboard</a>
        </li>
        <li className="breadcrumb-item active text-light-dark">Mes signalements d'entreprises</li>
      </ol>

      {message && (
        <div className="alert alert-success" role="alert">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <i className="fas fa-clipboard-list me-1"></i>
            Liste des reclamationss
          </div>
          
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Mon entreprise</th>
                    <th>Entreprise signalée</th>
                    <th>Raison</th>
                    <th>Statut</th>
                    <th>Date du signalement</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reclamations.length > 0 ? (
                    reclamations.map(reclamation => (
                      <tr key={reclamation.id}>
                        <td>{reclamation.id}</td>
                        <td>{reclamation.nom_entreprise_post}</td>
                        <td>{reclamation.nom_entreprise_fraud}</td>
                        <td>{reclamation.raison}</td>
                        <td>
                          <span className={`badge ${reclamation.status === 'en attente' ? 'bg-warning' : 
                                           reclamation.status === 'validé' ? 'bg-success' : 
                                           reclamation.status === 'rejeté' ? 'bg-danger' : 'bg-secondary'}`}>
                            {reclamation.status}
                          </span>
                        </td>
                        <td>{new Date(reclamation.post_date).toLocaleDateString()}</td>
                        <td>
                          <div className="d-flex gap-2">
                            {reclamation.status === 'en attente' ? (
                              // Boutons actifs pour les réclamations en attente
                              <>
                                <button 
                                  className="btn btn-sm btn-outline-info"
                                  onClick={() => handleEdit(reclamation.id)}
                                  title="Éditer"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(reclamation.id)}
                                  title="Supprimer"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </>
                            ) : (
                              // Boutons désactivés en noir pour les réclamations validées ou rejetées
                              <>
                                <button 
                                  className="btn btn-sm btn-dark"
                                  disabled
                                  title="Action impossible - Réclamation déjà traitée"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-dark"
                                  disabled
                                  title="Action impossible - Réclamation déjà traitée"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Aucune rÃ©clamation trouvÃ©e pour votre entreprise
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListReclamation;
