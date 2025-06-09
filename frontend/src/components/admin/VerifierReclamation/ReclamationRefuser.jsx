import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiImages, BiDownload } from 'react-icons/bi';
import { BsFileEarmarkPdf, BsArrowRepeat, BsPencilSquare, BsEye } from 'react-icons/bs';

const RejectedReclamations = () => {
    const [reclamations, setReclamations] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
    });
    const [selectedObservation, setSelectedObservation] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const navigate = useNavigate();
    const API_BASE_URL = 'http://localhost:8000/api';

    // Fetch rejected reclamations on mount and page change
    useEffect(() => {
        const fetchData = async () => {
            const url = `${API_BASE_URL}/admin/rejected?page=${pagination.current_page}&limit=${pagination.per_page}`;
            console.log('Fetching rejected reclamations from:', url);
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error ${response.status}`);
                }

                const data = await response.json();
                if (!data.data || !data.data.reclamations || !data.data.pagination) {
                    throw new Error('Invalid API response structure');
                }
                setReclamations(data.data.reclamations);
                setPagination(data.data.pagination);
                setError('');
            } catch (error) {
                setError(error.message || 'Erreur lors du chargement des réclamations rejetées');
                console.error('Fetch error:', error);
                setTimeout(() => setError(''), 3000);
            }
        };
        fetchData();
    }, [pagination.current_page, pagination.per_page]);

    // Handle repost action
    const handleRepost = async (id) => {
        const url = `${API_BASE_URL}/admin/${id}/repost`;
        console.log('Reposting reclamation at:', url);
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error ${response.status}`);
            }

            const data = await response.json();
            setReclamations(reclamations.filter(pub => pub.id !== id));
            setStatusMessage(data.message || `Réclamation ${id} repostée avec succès`);
            setError('');
            setTimeout(() => setStatusMessage(''), 3000);
        } catch (error) {
            setError(error.message || 'Erreur lors du repostage de la réclamation');
            console.error('Repost error:', error);
            setTimeout(() => setError(''), 3000);
        }
    };

   

    const handleShowObservation = async (id) => {
        const url = `${API_BASE_URL}/admin/${id}/observation`;
        console.log('Fetching observation for reclamation at:', url);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error ${response.status}`);
            }
    
            const data = await response.json();
            const observation = data.data.observation || { reclamation: 'Aucune observation disponible' };
            setSelectedObservation({ id, ...observation });
            setError('');
        } catch (error) {
            setError(error.message || 'Erreur lors du chargement de l\'observation');
            console.error('Observation fetch error:', error);
            setTimeout(() => setError(''), 3000);
        }
    };
    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.last_page) {
            setPagination({ ...pagination, current_page: page });
        }
    };

    // Determine badge class based on status
    const getBadgeClass = (status) => {
        switch (status) {
            case 'en attente':
                return 'bg-warning text-dark';
            case 'rejeté':
                return 'bg-danger';
            case 'validé':
                return 'bg-success';
            default:
                return 'bg-secondary';
        }
    };

    // Render proof icon based on file type
    const renderProofIcon = (file) => {
        if (!file) return 'Aucune preuve';

        const extension = file.split('.').pop().toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            return (
                <a href={`${API_BASE_URL}/Uploads/${file}`} target="_blank" rel="noopener noreferrer">
                    <BiImages className="text-dark fs-3" />
                </a>
            );
        } else if (extension === 'pdf') {
            return (
                <a href={`${API_BASE_URL}/Uploads/${file}`} target="_blank" rel="noopener noreferrer">
                    <BsFileEarmarkPdf className="text-danger fs-3" />
                </a>
            );
        } else {
            return (
                <a href={`${API_BASE_URL}/Uploads/${file}`} download>
                    <BiDownload className="text-dark fs-3" />
                </a>
            );
        }
    };

    return (
        <main>
            <div className="page-content page-container" id="page-content">
                <div className="container-fluid px-4 my-3">
                    <ol className="breadcrumb mb-2 text-light p-3 bg-light rounded shadow-sm">
                        <li className="breadcrumb-item">
                            <Link to="/admin/dashboard" className="text-warning">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item active text-dark">Réclamations Rejetées</li>
                    </ol>

                    <div className="col-lg-90 grid-margin stretch-card my-3">
                        <div className="card">
                            <div className="card-body">
                                {statusMessage && (
                                    <div className="alert alert-success">{statusMessage}</div>
                                )}
                                {error && (
                                    <div className="alert alert-danger">{error}</div>
                                )}

                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Entreprise</th>
                                                <th>Rc</th>
                                                <th>ICE</th>
                                                <th>Entreprise Frauduleuse</th>
                                                <th>Raison</th>
                                                <th>Preuve</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reclamations.map((reclamation) => (
                                                <tr key={reclamation.id}>
                                                    <td>{reclamation.nom_entreprise_post}</td>
                                                    <td>{reclamation.rc}</td>
                                                    <td>{reclamation.ice}</td>
                                                    <td>{reclamation.nom_entreprise_fraud}</td>
                                                    <td>{reclamation.raison}</td>
                                                    <td>{renderProofIcon(reclamation.preuve_file)}</td>
                                                    <td>
                                                        <span className={`badge ${getBadgeClass(reclamation.status)}`}>
                                                            {reclamation.status}
                                                        </span>
                                                    </td>
                                                    <td className="d-flex flex-row justify-content-center gap-2 py-3">
                                                        <button
                                                            onClick={() => handleRepost(reclamation.id)}
                                                            className="btn"
                                                            title="Reposter"
                                                        >
                                                            <BsArrowRepeat className="fs-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleShowObservation(reclamation.id)}
                                                            className="btn "
                                                            title="Voir Observation"
                                                        >
                                                            <BsEye className="fs-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="pagination mt-4 d-flex justify-content-center">
                                    {pagination.current_page > 1 && (
                                        <a
                                            href="#"
                                            className="btn btn-outline-secondary mx-1"
                                            onClick={() => handlePageChange(pagination.current_page - 1)}
                                        >
                                            Prev
                                        </a>
                                    )}
                                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                                        <a
                                            key={page}
                                            href="#"
                                            className={`btn btn-outline-secondary mx-1 ${page === pagination.current_page ? 'active' : ''}`}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </a>
                                    ))}
                                    {pagination.current_page < pagination.last_page && (
                                        <a
                                            href="#"
                                            className="btn btn-outline-secondary mx-1"
                                            onClick={() => handlePageChange(pagination.current_page + 1)}
                                        >
                                            Next
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             {/* Observation Modal */}
                                
            {selectedObservation && (
                                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Observation pour Réclamation #{selectedObservation.id}</h5>
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        onClick={() => setSelectedObservation(null)}
                                                    ></button>
                                                </div>
                                                <div className="modal-body">
                                                    <p>{selectedObservation.reclamation}</p>
                                                </div>
                                                <div className="modal-footer">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={() => setSelectedObservation(null)}
                                                    >
                                                        Fermer
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
        </main>
    );
};

export default RejectedReclamations;