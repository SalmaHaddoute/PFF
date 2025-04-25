import React, { useState } from 'react';
import './ReclamationRefuser.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
// Default data simulating database query
const defaultPublications = [
    {
        id: 1,
        nom_entreprise_post: "Company A",
        nom_entreprise_fraud: "Fraud Company X",
        raison: "Non-payment of services",
        preuve_file: "proof1.pdf",
        status: "rejété",
        reclamation: "Incomplete documentation provided."
    },
    {
        id: 2,
        nom_entreprise_post: "Company B",
        nom_entreprise_fraud: "Fraud Company Y",
        raison: "Contract violation",
        preuve_file: "proof2.jpg",
        status: "rejété",
        reclamation: "Evidence does not support the claim."
    },
    {
        id: 3,
        nom_entreprise_post: "Company C",
        nom_entreprise_fraud: "Fraud Company Z",
        raison: "Intellectual property theft",
        preuve_file: "",
        status: "rejété",
        reclamation: null
    }
];

// Simulated logged-in user
// eslint-disable-next-line no-unused-vars
const loggedInUser = {
    username: "Example Company"
};

const ReclamationRefuser = () => {
    // eslint-disable-next-line no-unused-vars
    const [publications, setPublications] = useState(defaultPublications);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    const handleShowMessage = (reclamation) => {
        setPopupMessage(reclamation || "Aucune observation disponible.");
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setPopupMessage("");
    };

    const getFileIcon = (filename) => {
        if (!filename) return null;

        const extension = filename.split('.').pop().toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            return <i className="bi bi-images"></i>;
        } else if (extension === 'pdf') {
            return <i className="bi bi-file-earmark-pdf"></i>;
        } else {
            return <i className="bi bi-download"></i>;
        }
    };

    return (
       
            <main className="p-6"> <div>
            <div className="container-fluid px-4">
              <ol className="breadcrumb text-light p-3 rounded shadow-sm">
                <li className="breadcrumb-item">
                  <a href="/dashboard" className="text-warning">
                    Dashboard
                  </a>
                </li>
                <li className="breadcrumb-item active text-light-dark">listes des réclamation</li>
              </ol>
              <div className="card-body">
                    <div className="table-container">
                        <div className="table-wrapper">
                            <div className="table-scroll">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Entreprise Réclamer</th>
                                            <th>Entreprise Fraud</th>
                                            <th>Raison</th>
                                            <th>Preuve</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {publications.length > 0 ? (
                                            publications.map((publication) => (
                                                <tr key={publication.id}>
                                                    <td className="id">{publication.id}</td>
                                                    <td>{publication.nom_entreprise_post}</td>
                                                    <td>{publication.nom_entreprise_fraud}</td>
                                                    <td>{publication.raison}</td>
                                                    <td>
                                                        {publication.preuve_file ? (
                                                            <a 
                                                                href={`/uploads/${publication.preuve_file}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="proof-link"
                                                            >
                                                                {getFileIcon(publication.preuve_file)}
                                                            </a>
                                                        ) : (
                                                            <span className="no-proof">Aucune preuve</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span className="badge">{publication.status}</span>
                                                    </td>
                                                    <td>
                                                        <div className="actions">
                                                            <a href="#" className="edit" title="Modifier">
                                                                <i className="bi bi-pencil-square"></i>
                                                            </a>
                                                            <button className="repost" title="Reposter">
                                                                <i className="bi bi-arrow-clockwise"></i>
                                                            </button>
                                                            <button 
                                                                onClick={() => handleShowMessage(publication.reclamation)}
                                                                className="show-message"
                                                                title="Voir observation">
                                                                <i className="bi bi-question-circle"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="no-data">
                                                    Aucune Réclamation Refuser trouvée.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    </div>
            </div>
               

            {/* Popup Overlay */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <span className="close-btn" onClick={closePopup}>×</span>
                        <p>{popupMessage}</p>
                    </div>
                </div>
            )}
        </div> 
        </main>
    );
};

export default ReclamationRefuser;