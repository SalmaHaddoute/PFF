import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Form, InputGroup, Pagination, Spinner, Alert, Modal } from 'react-bootstrap';
import { FaSearch, FaEye, FaFilter, FaChevronLeft, FaChevronRight, FaDatabase, FaBuilding, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBusinessTime } from 'react-icons/fa';
import axios from 'axios';
import './ChercherEn.css';

const ChercherEn = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('username');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEntreprise, setSelectedEntreprise] = useState(null);
  const itemsPerPage = 10;

  const API_BASE_URL = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/entreprises/search`, {
          params: {
            term: searchTerm,
            filter: filterType,
          },
        });
        setEntreprises(response.data);
      } catch (error) {
        console.error('Error fetching enterprises:', error);
        console.error('Error details:', error.response?.data || error.message);
        setEntreprises([]);
        setError('Échec du chargement des entreprises. Veuillez vérifier la connexion au serveur.');
      } finally {
        setLoading(false);
      }
    };

    fetchEntreprises();
  }, [searchTerm, filterType]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = entreprises.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(entreprises.length / itemsPerPage);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleShowDetails = (entreprise) => {
    setSelectedEntreprise(entreprise);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedEntreprise(null);
  };

  return (
    <div className="container-fluid px-4">
      <div className="page-content" id="page-content">
        <div className="container-fluid px-4 my-3">
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb mb-4 text-dark p-3 rounded shadow-sm bg-light">
              <li className="breadcrumb-item">
                <a href="/admin/dashboard" className="text-warning">Dashboard</a>
              </li>
              <li className="breadcrumb-item active text-dark">Chercher Entreprise</li>
            </ol>
          </nav>

          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="mb-0 fw-semibold">Recherche d'Entreprises</h5>
            </div>
            <div className="card-body">
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSearch}>
                <div className="row g-3 align-items-center mb-4">
                  <div className="col-md-8">
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control-lg border-end-0 text-dark"
                        placeholder="Rechercher par nom, adresse ou secteur"
                      />
                      <InputGroup.Text className="bg-white border-start-0">
                        <FaSearch />
                      </InputGroup.Text>
                    </InputGroup>
                  </div>
                  <div className="col-md-3">
                    <Form.Select 
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="form-select-lg"
                    >
                      <option value="username">Nom Entreprise</option>
                      <option value="address">Adresse</option>
                      <option value="secteur.nom">Secteur</option>
                    </Form.Select>
                  </div>
                  <div className="col-md-1">
                    <Button 
                      type="submit" 
                      variant="warning" 
                      className="btn-lg w-100"
                    >
                      <FaFilter />
                    </Button>
                  </div>
                </div>
              </Form>

              <div className="search-results mt-4">
                {searchTerm && (
                  <h5 className="mb-4 text-dark">
                    Résultats pour "{searchTerm}" ({entreprises.length})
                  </h5>
                )}
                
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="py-3 px-4 text-uppercase small fw-semibold">ID</th>
                          <th className="py-3 px-4 text-uppercase small fw-semibold">ICE</th>
                          <th className="py-3 px-4 text-uppercase small fw-semibold">RC</th>
                          <th className="py-3 px-4 text-uppercase small fw-semibold">Nom Entreprise</th>
                          <th className="py-3 px-4 text-uppercase small fw-semibold">Adresse</th>
                          <th className="py-3 px-4 text-uppercase small fw-semibold">Secteur</th>
                          <th className="py-3 px-4 text-uppercase small fw-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.length > 0 ? (
                          currentItems.map(entreprise => (
                            <tr key={entreprise.id} className="border-top">
                              <td className="py-3 px-4">{entreprise.id}</td>
                              <td className="py-3 px-4">{entreprise.ice || '-'}</td>
                              <td className="py-3 px-4">{entreprise.rc || '-'}</td>
                              <td className="py-3 px-4">{entreprise.username || '-'}</td>
                              <td className="py-3 px-4">{entreprise.address || '-'}</td>
                              <td className="py-3 px-4">
                                <Badge bg="secondary">
                                  {entreprise.secteur?.nom || '-'} {/* Changed to nom */}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Button 
                                  variant="info" 
                                  size="sm" 
                                  title="Voir détails"
                                  onClick={() => handleShowDetails(entreprise)}
                                >
                                  <FaEye />
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-top">
                            <td colSpan="7" className="text-center py-4">
                              <FaDatabase className="fa-2x text-muted mb-2" />
                              <p className="text-muted">Aucune entreprise trouvée</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                )}

                {entreprises.length > itemsPerPage && (
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light">
                    <div className="text-muted small">
                      Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, entreprises.length)} sur {entreprises.length} entrées
                    </div>
                    <div className="d-flex">
                      <Pagination>
                        <Pagination.Prev 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <FaChevronLeft />
                        </Pagination.Prev>
                        
                        {[...Array(totalPages)].map((_, i) => (
                          <Pagination.Item
                            key={i + 1}
                            active={i + 1 === currentPage}
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </Pagination.Item>
                        ))}
                        
                        <Pagination.Next
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          <FaChevronRight />
                        </Pagination.Next>
                      </Pagination>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal de détails */}
          <Modal 
            show={showDetailsModal} 
            onHide={handleCloseDetailsModal}
            size="lg"
            centered
          >
            <Modal.Header closeButton className="bg-light">
              <Modal.Title className="fw-semibold text-dark">
                <FaBuilding className="me-2" />
                Détails de l'Entreprise
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedEntreprise && (
                <div className="row g-4">
                  {/* Informations principales */}
                  <div className="col-md-12 mb-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title mb-3 text-primary">
                          <FaUser className="me-2" />
                          Informations Générales
                        </h5>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <p className="mb-2"><strong>ID:</strong> {selectedEntreprise.id}</p>
                            <p className="mb-2"><strong>Nom:</strong> {selectedEntreprise.username || '-'}</p>
                            <p className="mb-2"><strong>ICE:</strong> {selectedEntreprise.ice || '-'}</p>
                            <p className="mb-2"><strong>RC:</strong> {selectedEntreprise.rc || '-'}</p>
                          </div>
                          <div className="col-md-6">
                            <p className="mb-2"><strong>Secteur:</strong> {selectedEntreprise.secteur?.nom || '-'}</p>
                            <p className="mb-2"><strong>Date d'inscription:</strong> {selectedEntreprise.created_at ? new Date(selectedEntreprise.created_at).toLocaleDateString() : '-'}</p>
                            <p className="mb-2"><strong>Dernière mise à jour:</strong> {selectedEntreprise.updated_at ? new Date(selectedEntreprise.updated_at).toLocaleDateString() : '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coordonnées */}
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body">
                        <h5 className="card-title mb-3 text-primary">
                          <FaMapMarkerAlt className="me-2" />
                          Coordonnées
                        </h5>
                        <p className="mb-2"><strong>Adresse:</strong> {selectedEntreprise.address || '-'}</p>
                        <p className="mb-2"><strong>Téléphone:</strong> {selectedEntreprise.telephone || '-'}</p>
                        <p className="mb-2"><strong>Email:</strong> {selectedEntreprise.email || '-'}</p>
                        <p className="mb-2"><strong>Ville:</strong> {selectedEntreprise.ville || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Informations complémentaires */}
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body">
                        <h5 className="card-title mb-3 text-primary">
                          <FaBusinessTime className="me-2" />
                          Informations Complémentaires
                        </h5>
                        <p className="mb-2"><strong>IF:</strong> {selectedEntreprise.if || '-'}</p>
                        <p className="mb-2"><strong>Site Web:</strong> {selectedEntreprise.website || '-'}</p>
                        <p className="mb-2"><strong>Statut:</strong> 
                          <Badge bg={selectedEntreprise.status === 'active' ? 'success' : 'danger'} className="ms-2">
                            {selectedEntreprise.status || 'Indéfini'}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDetailsModal}>
                Fermer
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ChercherEn;