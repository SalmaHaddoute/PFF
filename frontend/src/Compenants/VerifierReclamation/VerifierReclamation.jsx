import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiImages, BiDownload } from 'react-icons/bi';
import { BsFileEarmarkPdf, BsCheck2Circle, BsXCircle } from 'react-icons/bs';

const VerifierReclamation = () => {
    // Sample data - replace with actual API calls
    const [publications, setPublications] = useState([
        {
            id_entreprise: 1,
            nom_entreprise_post: "Entreprise A",
            nom_entreprise_fraud: "Frauduleuse X",
            raison: "Fausse représentation",
            preuve_file: "document.pdf",
            status: "en attente",
            date_publication: "2023-05-15"
        },
        {
            id_entreprise: 2,
            nom_entreprise_post: "Entreprise B",
            nom_entreprise_fraud: "Frauduleuse Y",
            raison: "Arnaque financière",
            preuve_file: "image.jpg",
            status: "en attente",
            date_publication: "2023-05-16"
        },
        {
            id_entreprise: 3,
            nom_entreprise_post: "Entreprise C",
            nom_entreprise_fraud: "Frauduleuse Z",
            raison: "Contrefaçon",
            preuve_file: "",
            status: "en attente",
            date_publication: "2023-05-17"
        },
        {
            id_entreprise: 4,
            nom_entreprise_post: "Entreprise D",
            nom_entreprise_fraud: "Frauduleuse W",
            raison: "Escroquerie",
            preuve_file: "document2.pdf",
            status: "en attente",
            date_publication: "2023-05-18"
        }
    ]);

    const [statusMessage, setStatusMessage] = useState('');

    // Function to handle status update
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            // Here you would make an API call to update the status
            // For now, we'll just update the local state
            setPublications(publications.map(pub => 
                pub.id_entreprise === id ? {...pub, status: newStatus} : pub
            ));
            
            setStatusMessage(`Publication ${id} marquée comme ${newStatus}`);
            setTimeout(() => setStatusMessage(''), 3000);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // Function to handle rejection (would navigate to rejection form)
    const handleReject = (id) => {
        // In a real app, you would navigate to the rejection form
        console.log(`Navigating to rejection form for publication ${id}`);
    };

    // Function to determine badge class based on status
    const getBadgeClass = (status) => {
        switch (status) {
            case 'en attente':
                return 'bg-warning text-dark';
            case 'rejected':
                return 'bg-danger';
            case 'validé':
                return 'bg-success';
            default:
                return 'bg-secondary';
        }
    };

    // Function to render proof icon based on file type
    const renderProofIcon = (file) => {
        if (!file) return "Aucune preuve";
        
        const extension = file.split('.').pop().toLowerCase();
        
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            return (
                <a href={`/view/image/${file}`} target="_blank" rel="noopener noreferrer">
                    <BiImages className="text-dark fs-3" />
                </a>
            );
        } else if (extension === 'pdf') {
            return (
                <a href={`/view/file/${file}`} target="_blank" rel="noopener noreferrer">
                    <BsFileEarmarkPdf className="text-danger fs-3" />
                </a>
            );
        } else {
            return (
                <a href={`/uploads/${file}`} download>
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
                        <li className="breadcrumb-item active text-dark">Verifier Réclamations</li>
                    </ol>

                    <div className="col-lg-90 grid-margin stretch-card my-3">
                        <div className="card">
                            <div className="card-body">
                                {statusMessage && (
                                    <div className="alert alert-info">{statusMessage}</div>
                                )}
                                
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Entreprise</th>
                                                <th>Entreprise Frauduleuse</th>
                                                <th>Raison</th>
                                                <th>Preuve</th>
                                                <th>Status</th>
                                                <th>Date de Publication</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {publications.map((publication) => (
                                                <tr key={publication.id_entreprise}>
                                                    <td>{publication.id_entreprise}</td>
                                                    <td>{publication.nom_entreprise_post}</td>
                                                    <td>{publication.nom_entreprise_fraud}</td>
                                                    <td>{publication.raison}</td>
                                                    <td>
                                                        {renderProofIcon(publication.preuve_file)}
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${getBadgeClass(publication.status)}`}>
                                                            {publication.status}
                                                        </span>
                                                    </td>
                                                    <td>{publication.date_publication}</td>
                                                    <td className="d-flex flex-column align-items-center">
                                                        {/* Accept button */}
                                                        <button 
                                                            onClick={() => handleStatusUpdate(publication.id_entreprise, 'validé')}
                                                            className="btn" 
                                                            title="Accepter"
                                                        >
                                                            <BsCheck2Circle className="fs-3" />
                                                        </button>
                                                        
                                                        {/* Reject button */}
                                                        <button 
                                                            onClick={() => handleReject(publication.id_entreprise)}
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default VerifierReclamation;