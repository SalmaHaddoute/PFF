import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import './ListTechnicien.css'; // Create this CSS file for styling

const ListTechnicien = () => {
  const [techniciens, setTechniciens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  // Fetch technicians from backend with pagination
  const fetchTechniciens = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`/techniciens?page=${page}&limit=${itemsPerPage}&search=${search}`);
      setTechniciens(response.data.techniciens);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des techniciens");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechniciens(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleEdit = (technicien) => {
    setEditingId(technicien.id);
    setEditForm({
      cin: technicien.cin,
      nom: technicien.nom,
      adresse: technicien.adresse,
      email: technicien.email,
      telephone: technicien.telephone,
    });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`/techniciens/${id}`, editForm);
      fetchTechniciens(currentPage, searchTerm); // Refresh data
      setEditingId(null);
    } catch (err) {
      console.error("Erreur lors de la mise à jour", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce technicien ?")) {
      try {
        await axios.delete(`/techniciens/${id}`);
        fetchTechniciens(currentPage, searchTerm); // Refresh data
      } catch (err) {
        console.error("Erreur lors de la suppression", err);
      }
    }
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchTechniciens(1, searchTerm);
  };

  return (
    <main>
      <div className="container-fluid px-4 my-3">
        <ol className="breadcrumb mb-4 text-light p-3 rounded shadow-sm">
          <li className="breadcrumb-item">
            <a href="#" className="text-warning">
              Dashboard
            </a>
          </li>
          <li className="breadcrumb-item active text-light-dark">
            Liste des Techniciens
          </li>
        </ol>

        {error && (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        )}

        <div className="card mb-4">
          <div className="card-header bg-dark text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Techniciens</h5>
              <form onSubmit={handleSearch} className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn btn-warning">
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>CIN</th>
                      <th>Nom</th>
                      <th>Adresse</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Secteur</th>
                      <th>Entreprise</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {techniciens.length > 0 ? (
                      techniciens.map((technicien) => (
                        <tr key={technicien.id}>
                          <td>{technicien.id}</td>
                          <td>
                            {editingId === technicien.id ? (
                              <input
                                type="text"
                                name="cin"
                                value={editForm.cin || ""}
                                onChange={handleInputChange}
                                className="form-control form-control-sm"
                              />
                            ) : (
                              technicien.cin
                            )}
                          </td>
                          <td>
                            {editingId === technicien.id ? (
                              <input
                                type="text"
                                name="nom"
                                value={editForm.nom || ""}
                                onChange={handleInputChange}
                                className="form-control form-control-sm"
                              />
                            ) : (
                              technicien.nom
                            )}
                          </td>
                          <td>
                            {editingId === technicien.id ? (
                              <input
                                type="text"
                                name="adresse"
                                value={editForm.adresse || ""}
                                onChange={handleInputChange}
                                className="form-control form-control-sm"
                              />
                            ) : (
                              technicien.adresse
                            )}
                          </td>
                          <td>
                            {editingId === technicien.id ? (
                              <input
                                type="email"
                                name="email"
                                value={editForm.email || ""}
                                onChange={handleInputChange}
                                className="form-control form-control-sm"
                              />
                            ) : (
                              technicien.email
                            )}
                          </td>
                          <td>
                            {editingId === technicien.id ? (
                              <input
                                type="text"
                                name="telephone"
                                value={editForm.telephone || ""}
                                onChange={handleInputChange}
                                className="form-control form-control-sm"
                              />
                            ) : (
                              technicien.telephone
                            )}
                          </td>
                          <td>{technicien.secteur_nom}</td>
                          <td>{technicien.entreprise_nom}</td>
                          <td>
                            <div className="d-flex gap-2">
                              {editingId === technicien.id ? (
                                <button
                                  onClick={() => handleSave(technicien.id)}
                                  className="btn btn-success btn-sm"
                                  title="Enregistrer"
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleEdit(technicien)}
                                  className="btn btn-primary btn-sm"
                                  title="Modifier"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(technicien.id)}
                                className="btn btn-danger btn-sm"
                                title="Supprimer"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center py-4">
                          Aucun technicien trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                      Précédent
                    </button>
                  </li>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    >
                      Suivant
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ListTechnicien;