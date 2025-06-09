
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiImages, BiDownload } from 'react-icons/bi';
import { BsFileEarmarkPdf, BsCheck2Circle, BsXCircle } from 'react-icons/bs';

const VerifierReclamation = () => {
    const [reclamations, setReclamations] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
    });
    const navigate = useNavigate();
    const API_BASE_URL = 'http://localhost:8000/api';

    // Fetch reclamations on mount and page change
    useEffect(() => {
        const fetchData = async () => {
            const url = `${API_BASE_URL}/admin/Reclamations/check?page=${pagination.current_page}&limit=${pagination.per_page}`;
            console.log('Fetching reclamations from:', url);
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
                setError(error.message || 'Erreur lors du chargement des réclamations');
                console.error('Fetch error:', error);
                setTimeout(() => setError(''), 3000);
            }
        };
        fetchData();
    }, [pagination.current_page, pagination.per_page]);

    // Handle status update
    const handleStatusUpdate = async (id) => {
        const url = `${API_BASE_URL}/admin/Reclamations/${id}/status`;
        console.log('Updating status at:', url);
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ status: 'validé' }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error ${response.status}`);
            }

            const data = await response.json();
            setReclamations(reclamations.map(pub =>
                pub.id === id ? { ...pub, status: 'validé' } : pub
            ));
            setStatusMessage(data.message || `Réclamation ${id} marquée comme validé`);
            setError('');
            setTimeout(() => setStatusMessage(''), 3000);
        } catch (error) {
            setError(error.message || 'Erreur lors de la mise à jour du statut');
            console.error('Status update error:', error);
            setTimeout(() => setError(''), 3000);
        }
    };

    // Handle rejection (navigate to observation form)
    const handleReject = (id) => {
        console.log('Navigating to AjouterObservation with id:', id);
        navigate(`/admin/ajouter-observation?id=${id}`);
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
                <a href={`${API_BASE_URL}/uploads/${file}`} target="_blank" rel="noopener noreferrer">
                    <BiImages className="text-dark fs-3" />
                </a>
            );
        } else if (extension === 'pdf') {
            return (
                <a href={`${API_BASE_URL}/uploads/${file}`} target="_blank" rel="noopener noreferrer">
                    <BsFileEarmarkPdf className="text-danger fs-3" />
                </a>
            );
        } else {
            return (
                <a href={`${API_BASE_URL}/uploads/${file}`} download>
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
                        <li className="breadcrumb-item active text-dark">Vérifier Réclamations</li>
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
                                                <th>Date de Publication</th>
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
                                                    <td>{new Date(reclamation.post_date).toLocaleDateString()}</td>
                                                    <td className="d-flex flex-column align-items-center">
                                                        <button
                                                            onClick={() => handleStatusUpdate(reclamation.id)}
                                                            className="btn"
                                                            title="Accepter"
                                                        >
                                                            <BsCheck2Circle className="fs-3" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(reclamation.id)}
                                                            className="btn"
                                                            title="Rejeter"
                                                        >
                                                            <BsXCircle className="fs-3" />
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
        </main>
    );
};

export default VerifierReclamation;