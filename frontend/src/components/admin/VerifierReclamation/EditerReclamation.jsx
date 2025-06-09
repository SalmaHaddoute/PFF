import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BiImages, BiDownload, BiX } from 'react-icons/bi';
import { BsFileEarmarkPdf } from 'react-icons/bs';

const EditerReclamation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [reclamation, setReclamation] = useState(null);
    const [formData, setFormData] = useState({
        raison: '',
        preuve_file: null,
        preuve_file_url: ''
    });
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const API_BASE_URL = 'http://localhost:8000/api';

    // Get reclamation ID from URL query params
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const id = queryParams.get('id');
        
        if (id) {
            fetchReclamation(id);
        } else {
            setError('No reclamation ID provided');
            setIsLoading(false);
        }
    }, [location]);

    // Fetch reclamation data
    const fetchReclamation = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/reclamations/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch reclamation');
            }

            const data = await response.json();
            setReclamation(data.data.reclamation);
            setFormData({
                raison: data.data.reclamation.raison,
                preuve_file: null,
                preuve_file_url: data.data.reclamation.preuve_file
                    ? `${API_BASE_URL}/Uploads/${data.data.reclamation.preuve_file}`
                    : ''
            });
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle file input change
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setFormData(prev => ({
                ...prev,
                preuve_file: file,
                preuve_file_url: URL.createObjectURL(file)
            }));
        }
    };

    // Remove selected file
    const removeFile = () => {
        setFormData(prev => ({
            ...prev,
            preuve_file: null,
            preuve_file_url: ''
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setStatusMessage('');

        if (!formData.raison) {
            setError('La raison est obligatoire');
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('raison', formData.raison);
            if (formData.preuve_file) {
                formDataToSend.append('preuve_file', formData.preuve_file);
            }

            const response = await fetch(`${API_BASE_URL}/admin/reclamations/${reclamation.id}`, {
                method: 'PUT',
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update reclamation');
            }

            const data = await response.json();
            setStatusMessage(data.message || 'Réclamation mise à jour avec succès');
            setTimeout(() => {
                navigate('/admin/rejected-reclamations');
            }, 2000);
        } catch (error) {
            setError(error.message || 'Erreur lors de la mise à jour de la réclamation');
            console.error('Update error:', error);
        }
    };

    // Render file preview
    const renderFilePreview = () => {
        if (!formData.preuve_file_url) return null;

        const extension = formData.preuve_file_url.split('.').pop().toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            return (
                <div className="position-relative" style={{ width: '200px' }}>
                    <img 
                        src={formData.preuve_file_url} 
                        alt="Preuve" 
                        className="img-thumbnail" 
                    />
                    <button 
                        onClick={removeFile}
                        className="position-absolute top-0 end-0 btn btn-sm btn-danger"
                    >
                        <BiX />
                    </button>
                </div>
            );
        } else if (extension === 'pdf') {
            return (
                <div className="position-relative" style={{ width: '200px' }}>
                    <BsFileEarmarkPdf className="text-danger fs-1" />
                    <button 
                        onClick={removeFile}
                        className="position-absolute top-0 end-0 btn btn-sm btn-danger"
                    >
                        <BiX />
                    </button>
                </div>
            );
        }
        return null;
    };

    if (isLoading) {
        return <div className="text-center my-5">Chargement...</div>;
    }

    if (error && !reclamation) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <main>
            <div className="page-content page-container" id="page-content">
                <div className="container-fluid px-4 my-3">
                    <ol className="breadcrumb mb-2 text-light p-3 bg-light rounded shadow-sm">
                        <li className="breadcrumb-item">
                            <Link to="/admin/dashboard" className="text-warning">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/admin/rejected-reclamations" className="text-warning">Réclamations Rejetées</Link>
                        </li>
                        <li className="breadcrumb-item active text-dark">Modifier Réclamation</li>
                    </ol>

                    <div className="col-lg-90 grid-margin stretch-card my-3">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Modifier la Réclamation #{reclamation.id}</h4>
                                
                                {statusMessage && (
                                    <div className="alert alert-success">{statusMessage}</div>
                                )}
                                {error && (
                                    <div className="alert alert-danger">{error}</div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Entreprise</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={reclamation.nom_entreprise_post} 
                                            readOnly 
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">RC</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={reclamation.rc} 
                                            readOnly 
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">ICE</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={reclamation.ice} 
                                            readOnly 
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Entreprise Frauduleuse</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={reclamation.nom_entreprise_fraud} 
                                            readOnly 
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Raison *</label>
                                        <textarea 
                                            className="form-control" 
                                            name="raison"
                                            value={formData.raison}
                                            onChange={handleInputChange}
                                            rows="3"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Preuve Actuelle</label>
                                        {reclamation.preuve_file ? (
                                            <a 
                                                href={`${API_BASE_URL}/Uploads/${reclamation.preuve_file}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="d-block mb-2"
                                            >
                                                {reclamation.preuve_file}
                                            </a>
                                        ) : (
                                            <p>Aucune preuve</p>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Nouvelle Preuve (optionnel)</label>
                                        <input 
                                            type="file" 
                                            className="form-control" 
                                            onChange={handleFileChange}
                                            accept=".jpg,.jpeg,.png,.gif,.pdf"
                                        />
                                        <small className="text-muted">Formats acceptés: JPG, PNG, GIF, PDF</small>
                                    </div>

                                    {renderFilePreview()}

                                    <div className="mt-4">
                                        <button type="submit" className="btn btn-primary me-2">
                                            Enregistrer les modifications
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => navigate('/admin/rejected-reclamations')}
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default EditerReclamation;