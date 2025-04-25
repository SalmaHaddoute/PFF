import React, { useState } from 'react';
import { Table, Badge, Button, Form, InputGroup, Pagination, Spinner } from 'react-bootstrap';
import { FaSearch, FaEye, FaFilter, FaChevronLeft, FaChevronRight, FaDatabase } from 'react-icons/fa';
import './ChercherEn.css'

const ChercherEn = () => {
  // Données par défaut
    const defaultEntreprises = [
        {
        id: 61,
        ice: '00',
        rc: '00',
        username: 'salma',
        email: 'salma@gmail.com',
        address: 'maroc',
        secteur: { nom: 'Services' },
        status: null,
        created_at: '2025-04-09T19:03:00'
        },
        {
        id: 60,
        ice: '11',
        rc: '11',
        username: 'sanaa',
        email: 'sanaa@gmail.com',
        address: '71233-6199',
        secteur: { nom: 'Bâtiment' },
        status: 'accepté',
        created_at: '2025-04-09T18:40:00'
        },
        {
        id: 59,
        ice: '777',
        rc: '777',
        username: 'ouissal',
        email: 'ouissal@gmail.com',
        address: 'maroc',
        secteur: { nom: 'Commerce' },
        status: 'refusé',
        created_at: '2025-04-08T22:21:00'
        }
    ];

    // États
    const [entreprises] = useState(defaultEntreprises); // Utilisé dans filteredEntreprises
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('username');
    const [loading] = useState(false); // Pourrait être utilisé pour un chargement futur
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filtrer les entreprises
    const filteredEntreprises = entreprises.filter(entreprise => {
        if (!searchTerm) return true;
        
        const term = searchTerm.toLowerCase();
        switch(filterType) {
        case 'username':
            return entreprise.username?.toLowerCase().includes(term);
        case 'address':
            return entreprise.address?.toLowerCase().includes(term);
        case 'secteur.nom':
            return entreprise.secteur?.nom?.toLowerCase().includes(term);
        default:
            return true;
        }
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEntreprises.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEntreprises.length / itemsPerPage);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset à la première page lors d'une nouvelle recherche
    };

    // Fonction pour simuler un chargement (exemple d'utilisation de setLoading)
    const simulateLoading = () => {
        // setLoading(true);
        // setTimeout(() => setLoading(false), 1000);
    };

    return (
        <div className="container-fluid px-4">
        <div className="page-content" id="page-content">
            <div className="container-fluid px-4 my-3">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb mb-4 text-dark p-3 rounded shadow-sm bg-light">
                <li className="breadcrumb-item">
                    <a href="/admin/dashboard" className="text-warning">Dashboard</a>
                </li>
                <li className="breadcrumb-item active text-dark">Chercher Entreprise</li>
                </ol>
            </nav>

            {/* Carte principale */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0 fw-semibold">Recherche d'Entreprises</h5>
                </div>
                <div className="card-body">
                {/* Formulaire de recherche */}
                <Form onSubmit={handleSearch}>
                    <div className="row g-3 align-items-center mb-4">
                    <div className="col-md-8">
                        <InputGroup>
                        <Form.Control
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-control-lg border-end-0"
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
                        onClick={simulateLoading} // Exemple d'utilisation
                        >
                        <FaFilter />
                        </Button>
                    </div>
                    </div>
                </Form>

                {/* Résultats de recherche */}
                <div className="search-results mt-4">
                    {searchTerm && (
                    <h5 className="mb-4 text-dark">
                        Résultats pour "{searchTerm}" ({filteredEntreprises.length})
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
                                    {entreprise.secteur?.nom || '-'}
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

                    {/* Pagination */}
                    {filteredEntreprises.length > itemsPerPage && (
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light">
                        <div className="text-muted small">
                        Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredEntreprises.length)} sur {filteredEntreprises.length} entrées
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