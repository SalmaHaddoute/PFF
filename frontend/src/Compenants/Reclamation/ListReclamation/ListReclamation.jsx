import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './ListReclamation.css'; // Fichier CSS séparé pour les styles personnalisés

const ListReclamation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Données par défaut simulant une session utilisateur
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState({
    id: 1,
    username: 'Entreprise ABC',
    userType: 'entreprise',
  });

  // Données par défaut simulant les publications
  const defaultPublications = [
    {
      id: 1,
      nom_entreprise_post: 'Entreprise ABC',
      nom_entreprise_fraud: 'Entreprise XYZ',
      raison: 'Non-paiement de facture',
      preuve_file: 'facture.pdf',
      status: 'en attente',
      date_publication: '2023-10-01 10:00:00',
    },
    {
      id: 2,
      nom_entreprise_post: 'Entreprise ABC',
      nom_entreprise_fraud: 'Entreprise DEF',
      raison: 'Livraison non conforme',
      preuve_file: 'photo.jpg',
      status: 'validé',
      date_publication: '2023-10-02 12:00:00',
    },
    {
      id: 3,
      nom_entreprise_post: 'Entreprise ABC',
      nom_entreprise_fraud: 'Entreprise GHI',
      raison: 'Fraude contractuelle',
      preuve_file: 'contrat.pdf',
      status: 'rejeté',
      date_publication: '2023-10-03 14:00:00',
    },
    {
      id: 4,
      nom_entreprise_post: 'Entreprise ABC',
      nom_entreprise_fraud: 'Entreprise JKL',
      raison: 'Retard de paiement',
      preuve_file: '',
      status: 'en attente',
      date_publication: '2023-10-04 16:00:00',
    },
  ];

  // État pour les publications et la pagination
  const [publications, setPublications] = useState(defaultPublications);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 4; // Nombre de résultats par page
  const totalRows = publications.length;
  const totalPages = Math.ceil(totalRows / limit);

  // État pour les messages
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Simuler les messages de session (par exemple, après une action)
  useEffect(() => {
    // Simuler un message de succès ou d'erreur depuis les paramètres de l'URL
    const params = new URLSearchParams(location.search);
    if (params.get('success')) {
      setMessage(params.get('success'));
      setTimeout(() => setMessage(''), 5000); // Effacer après 5 secondes
    }
    if (params.get('error')) {
      setError(params.get('error'));
      setTimeout(() => setError(''), 5000); // Effacer après 5 secondes
    }
  }, [location]);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (!user.id) {
      setError('Veuillez vous connecter pour voir les publications.');
      navigate('/login');
    }
  }, [user, navigate]);

  // Gérer la pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculer les publications à afficher pour la page actuelle
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const currentPublications = publications.slice(startIndex, endIndex);

  // Simuler la suppression d'une publication
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
      setPublications((prev) => prev.filter((pub) => pub.id !== id));
      setMessage('Publication supprimée avec succès.');
      setTimeout(() => setMessage(''), 5000);
    }
  };


  return (
   
              <div className="container-fluid px-4 my-3">
                <ol className="breadcrumb mb-2 text-light p-3 rounded shadow-sm">
                  <li className="breadcrumb-item">
                    <a href="/dashboard" className="text-warning">
                      Dashboard
                    </a>
                  </li>
                  <li className="breadcrumb-item active text-light-dark">Réclamations</li>
                </ol>

                {/* Messages */}
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
                              <th className="text-center">ID</th>
                              <th className="text-center">Entreprise</th>
                              <th className="text-center">Entreprise Frauduleuse</th>
                              <th className="text-center">Raison</th>
                              <th className="text-center">Preuve</th>
                              <th className="text-center">Status</th>
                              <th className="text-center">Date de Publication</th>
                              <th className="text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentPublications.map((row) => {
                              const fileExtension = row.preuve_file
                                ? row.preuve_file.split('.').pop().toLowerCase()
                                : '';
                              return (
                                <tr key={row.id}>
                                  <td className="text-center pt-4">{row.id}</td>
                                  <td className="text-center pt-4">{row.nom_entreprise_post}</td>
                                  <td className="text-center pt-4">{row.nom_entreprise_fraud}</td>
                                  <td className="text-center pt-4">{row.raison}</td>
                                  <td className="text-center pt-4">
                                    {row.preuve_file ? (
                                      <>
                                        {['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension) ? (
                                          <a
                                            href={`/uploads/${row.preuve_file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <i className="bi bi-images text-dark fs-3"></i>
                                          </a>
                                        ) : fileExtension === 'pdf' ? (
                                          <a
                                            href={`/Uploads/${row.preuve_file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <i className="bi bi-file-earmark-pdf text-danger fs-3"></i>
                                          </a>
                                        ) : (
                                          <a href={`/Uploads/${row.preuve_file}`} download>
                                            <i className="bi bi-download text-dark fs-3"></i>
                                          </a>
                                        )}
                                      </>
                                    ) : (
                                      'Aucune preuve'
                                    )}
                                  </td>
                                  <td className="text-center pt-4">
                                    <span
                                      className={`badge ${
                                        row.status === 'en attente'
                                          ? 'bg-warning text-dark'
                                          : row.status === 'rejeté'
                                          ? 'bg-danger'
                                          : row.status === 'validé'
                                          ? 'bg-success'
                                          : 'bg-secondary'
                                      }`}
                                    >
                                      {row.status}
                                    </span>
                                  </td>
                                  <td className="text-center pt-4">{row.date_publication}</td>
                                  <td className="text-center pt-4">
                                    {row.status === 'en attente' ? (
                                      <>
                                        <button type="button" className="btn btn-primary btn-sm">
                                          <a
                                            href={`/edit-post?id=${row.id}`}
                                            className="text-white"
                                          >
                                            <i className="bi bi-pencil-square"></i>
                                          </a>
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-secondary btn-sm ms-2"
                                          onClick={() => handleDelete(row.id)}
                                        >
                                          <i className="bi bi-trash3"></i>
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button type="button" className="btn btn-dark btn-sm">
                                          <i className="bi bi-pencil-square text-secondary"></i>
                                        </button>
                                        <button type="button" className="btn btn-dark btn-sm ms-2">
                                          <i className="bi bi-trash3 text-secondary"></i>
                                        </button>
                                      </>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <nav aria-label="Pagination">
                          <ul className="pagination justify-content-center mt-3">
                            {currentPage > 1 && (
                              <li className="page-item">
                                <a
                                  className="page-link bg-warning text-dark"
                                  href="#"
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  aria-label="Précédent"
                                >
                                  <span aria-hidden="true">«</span>
                                </a>
                              </li>
                            )}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <li
                                key={page}
                                className={`page-item ${page === currentPage ? 'active' : ''}`}
                              >
                                <a
                                  className="page-link bg-warning text-dark"
                                  href="#"
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </a>
                              </li>
                            ))}
                            {currentPage < totalPages && (
                              <li className="page-item">
                                <a
                                  className="page-link bg-warning text-dark"
                                  href="#"
                                  onClick={() => handlePageChange(currentPage + 1)}
                                  aria-label="Suivant"
                                >
                                  <span aria-hidden="true">»</span>
                                </a>
                              </li>
                            )}
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            
  );
};

export default ListReclamation;