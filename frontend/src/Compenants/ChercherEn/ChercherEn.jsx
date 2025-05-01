import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Form, InputGroup, Pagination, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaEye, FaFilter, FaChevronLeft, FaChevronRight, FaDatabase } from 'react-icons/fa';
import axios from 'axios';
import './ChercherEn.css';

const ChercherEn = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('username');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
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
                                <Button variant="info" size="sm" title="Voir détails">
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
        </div>
      </div>
    </div>
  );
};

export default ChercherEn;