/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BiImage, BiDownload } from 'react-icons/bi';
import { BsFileEarmarkPdf } from 'react-icons/bs';
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const BlacklistDirectory = () => {
    const [blacklist, setBlacklist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch blacklist data on component mount
    useEffect(() => {
        const fetchBlacklist = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/blacklists`);
                setBlacklist(response.data.data || response.data); // Handle potential nested data
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
                console.error('Error fetching blacklist data:', err);
            }
        };

        fetchBlacklist();
    }, []);

    // Render appropriate icon based on file type
    const renderProofIcon = (file) => {
        if (!file) return <span className="text-muted">Aucune preuve</span>;

        const extension = file.split('.').pop().toLowerCase();
        const filePath = `${API_BASE_URL}/storage/${file}`;

        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            return (
                <a
                    href={filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                >
                    <BiImage className="text-dark fs-4" title="Voir l'image" />
                </a>
            );
        } else if (extension === 'pdf') {
            return (
                <a
                    href={filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                >
                    <BsFileEarmarkPdf className="text-danger fs-4" title="Voir le PDF" />
                </a>
            );
        } else {
            return (
                <a
                    href={filePath}
                    download
                    className="text-decoration-none"
                >
                    <BiDownload className="text-dark fs-4" title="Télécharger" />
                </a>
            );
        }
    };

    // Table columns configuration
    const columns = [
        {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
            width: '80px',
        },
        {
            name: 'Signalé par',
            selector: (row) => row.nom_entreprise_post,
            sortable: true,
            cell: (row) => <span className="fw-semibold">{row.nom_entreprise_post}</span>,
        },
        {
            name: 'Entreprise frauduleuse',
            selector: (row) => row.nom_entreprise_fraud,
            sortable: true,
            cell: (row) => <span className="text-danger">{row.nom_entreprise_fraud}</span>,
        },
        {
            name: 'Raison',
            selector: (row) => row.raison,
            cell: (row) => (
                <div style={{ whiteSpace: 'pre-wrap' }} className="text-muted">
                    {row.raison}
                </div>
            ),
            sortable: true,
            minWidth: '200px',
        },
        {
            name: 'Preuve',
            cell: (row) => renderProofIcon(row.preuve_file),
            width: '100px',
            center: true,
        },
        {
            name: 'Date',
            selector: (row) => new Date(row.post_date).toLocaleDateString('fr-FR'),
            sortable: true,
            width: '120px',
        },
    ];

    // Custom table styling
    const customStyles = {
        headRow: {
            style: {
                backgroundColor: 'rgb(238, 198, 67)',
                color: 'white',
                fontWeight: '600',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                letterSpacing: '0.5px',
                border: 'none',
            },
        },
        headCells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '16px',
            },
        },
        rows: {
            style: {
                minHeight: '60px',
                '&:nth-child(even)': {
                    backgroundColor: '#f9fafc',
                },
                '&:hover': {
                    backgroundColor: '#f0f4ff',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(67, 97, 238, 0.1)',
                    cursor: 'pointer',
                },
                transition: 'all 0.2s ease',
            },
        },
        cells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '16px',
                borderBottom: '1px solid #f0f0f0',
                verticalAlign: 'middle',
            },
        },
    };

    if (loading) {
        return (
            <div className="container-fluid px-4">
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Chargement en cours...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid px-4">
                <div className="alert alert-danger mt-4">
                    Erreur lors du chargement des données: {error}
                    <button
                        className="btn btn-sm btn-outline-danger ms-3"
                        onClick={() => window.location.reload()}
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mt-4 mb-0">Blacklist Directory</h1>
                <Link to="/" className="btn btn-outline-secondary">
                    Retour au Dashboard
                </Link>
            </div>

            <div className="card mb-4 border-0 shadow-sm">
                <div className="card-body p-0">
                    <div className="p-4 pb-0">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-4 p-3 bg-light rounded">
                                <li className="breadcrumb-item">
                                    <Link to="/admin/dashboard" className="text-warning text-decoration-none">
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active text-dark">Blacklist</li>
                            </ol>
                        </nav>
                    </div>

                    <div className="p-4 pt-0">
                        {blacklist.length === 0 ? (
                            <div className="text-center py-5">
                                <h4 className="text-muted">Aucune entreprise blacklistée</h4>
                                <p className="text-muted">
                                    Les entreprises signalées et acceptées apparaîtront ici
                                </p>
                            </div>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={blacklist}
                                customStyles={customStyles}
                                pagination
                                paginationPerPage={10}
                                paginationRowsPerPageOptions={[5, 10, 25, 50]}
                                highlightOnHover
                                responsive
                                noDataComponent={
                                    <div className="py-4 text-center text-muted">
                                        Aucune donnée disponible
                                    </div>
                                }
                                defaultSortFieldId={1}
                                defaultSortAsc={false}
                                className="border-top"
                                progressPending={loading}
                                progressComponent={
                                    <div className="py-4 text-center">
                                        <div className="spinner-border text-warning" role="status">
                                            <span className="visually-hidden">Chargement...</span>
                                        </div>
                                    </div>
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlacklistDirectory;