import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AjouterSecteur.css';

const AjouterSecteur = () => {
    const [nom, setNom] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [secteurs, setSecteurs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5; // Items per page
    const navigate = useNavigate();
    const API_BASE_URL = 'http://localhost:8000/api';

    // Fetch secteurs on component mount and when page changes
    useEffect(() => {
        const fetchSecteurs = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/admin/secteur?page=${currentPage}&limit=${limit}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP error ${response.status}`);
                }

                const data = await response.json();
                setSecteurs(data.secteurs.map(secteur => ({ ...secteur, isEditing: false })));
                setTotalPages(data.totalPages);
            } catch (err) {
                console.error('Fetch secteurs error:', err.message, err);
                setError(err.message || 'Erreur lors du chargement des secteurs');
            }
        };
        fetchSecteurs();
    }, [currentPage]);

    // Handle form submission to add a new secteur
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/admin/secteur`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ nom }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `HTTP error ${response.status}`);
            }

            setSuccess(data.message || 'Secteur ajouté avec succès!');
            setError('');
            setNom('');
            // Refresh secteurs list
            const refreshResponse = await fetch(`${API_BASE_URL}/admin/secteur?page=${currentPage}&limit=${limit}`);
            const refreshData = await refreshResponse.json();
            setSecteurs(refreshData.secteurs.map(secteur => ({ ...secteur, isEditing: false })));
            setTotalPages(refreshData.totalPages);
            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/entreprises/secteurs');
            }, 2000);
        } catch (error) {
            console.error('Add secteur error:', error.message, error);
            setError(error.message || 'Erreur lors de l\'ajout du secteur');
            setSuccess('');
        }
    };

    // Handle edit button click
    const handleEdit = (id) => {
        setSecteurs(secteurs.map(secteur =>
            secteur.id === id ? { ...secteur, isEditing: true } : { ...secteur, isEditing: false }
        ));
    };

    // Handle save button click
    const handleSave = async (id, newNom) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/secteur/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ nom: newNom }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `HTTP error ${response.status}`);
            }

            setSecteurs(secteurs.map(secteur =>
                secteur.id === id ? { ...secteur, nom: newNom, isEditing: false } : secteur
            ));
            setSuccess(data.message || 'Secteur modifié avec succès!');
            setError('');
        } catch (error) {
            console.error('Edit secteur error:', error.message, error);
            setError(error.message || 'Erreur lors de la modification du secteur');
            setSuccess('');
        }
    };

    // Handle delete button click
    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce secteur ?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/admin/secteur/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || `HTTP error ${response.status}`);
                }

                // Refresh secteurs list
                const refreshResponse = await fetch(`${API_BASE_URL}/admin/secteur?page=${currentPage}&limit=${limit}`);
                const refreshData = await refreshResponse.json();
                setSecteurs(refreshData.secteurs.map(secteur => ({ ...secteur, isEditing: false })));
                setTotalPages(refreshData.totalPages);
                setSuccess(data.message || 'Secteur supprimé avec succès!');
                setError('');
            } catch (error) {
                console.error('Delete secteur error:', error.message, error);
                setError(error.message || 'Erreur lors de la suppression du secteur');
                setSuccess('');
            }
        }
    };

    // Handle pagination
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="container-fluid px-4 my-3">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb mb-2 text-dark bg-light p-3 rounded shadow-sm">
                    <li className="breadcrumb-item">
                        <a href="/admin/dashboard" className="text-warning">Dashboard</a>
                    </li>
                    <li className="breadcrumb-item active text-dark">Ajouter Secteur</li>
                </ol>
            </nav>

            <div className="card-body">
                {/* Success Message */}
                {success && (
                    <div className="alert alert-success text-center" role="alert">
                        {success}
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="p-4 rounded-3 shadow border border-light bg-white"
                    style={{ background: 'transparent' }}
                >
                    <h2 className="text-center text-dark fw-bold mb-4">Ajouter Secteur</h2>

                    <div className="d-flex justify-content-center align-items-center">
                        <div className="mb-4 me-2">
                            <label htmlFor="nom" className="form-label text-dark fw-lighter">
                                Secteur Nom :
                            </label>
                            <input
                                type="text"
                                className={`form-control border-0 border-bottom  text-dark shadow-none bg-transparent ${error ? 'is-invalid' : ''}`}
                                id="nom"
                                name="nom"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                required
                            />
                            {error && <div className="invalid-feedback">{error}</div>}
                        </div>

                        <div className="mb-4">
                            <button
                                type="submit"
                                className="btn btn-warning fw-lighter shadow-lg px-5 py-2"
                            >
                                Ajouter
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="text-center">ID</th>
                                <th className="text-center">Secteur Name</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {secteurs.map((secteur) => (
                                <tr key={secteur.id} id={`row-${secteur.id}`}>
                                    <td className="text-center pt-4">{secteur.id}</td>
                                    <td className="text-center pt-4">
                                        <span
                                            id={`nom-${secteur.id}`}
                                            style={{ display: secteur.isEditing ? 'none' : 'inline' }}
                                        >
                                            {secteur.nom}
                                        </span>
                                        <input
                                            type="text"
                                            id={`edit-nom-${secteur.id}`}
                                            className="form-control edit-input text-dark"
                                            defaultValue={secteur.nom}
                                            style={{ display: secteur.isEditing ? 'inline' : 'none' }}
                                            onBlur={(e) => handleSave(secteur.id, e.target.value)}
                                            autoFocus
                                        />
                                    </td>
                                    <td className="text-center pt-4">
                                        <button
                                            type="button"
                                            className="btn btn-warning btn-sm edit-btn"
                                            data-id={secteur.id}
                                            onClick={() => handleEdit(secteur.id)}
                                            style={{ display: secteur.isEditing ? 'none' : 'inline-block' }}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-success btn-sm save-btn"
                                            data-id={secteur.id}
                                            onClick={() => handleSave(secteur.id, document.getElementById(`edit-nom-${secteur.id}`).value)}
                                            style={{ display: secteur.isEditing ? 'inline-block' : 'none' }}
                                        >
                                            <i className="bi bi-check"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-dark btn-sm delete-btn"
                                            data-id={secteur.id}
                                            onClick={() => handleDelete(secteur.id)}
                                        >
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="pagination">
                        {currentPage > 1 && (
                            <a
                                href="#"
                                className="btn btn-outline-secondary"
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                Prev
                            </a>
                        )}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <a
                                key={page}
                                href="#"
                                className={`btn btn-outline-secondary ${page === currentPage ? 'active' : ''}`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </a>
                        ))}
                        {currentPage < totalPages && (
                            <a
                                href="#"
                                className="btn btn-outline-secondary"
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Next
                            </a>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AjouterSecteur;