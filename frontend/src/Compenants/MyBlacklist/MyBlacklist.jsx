import React from 'react';

import './MyBlacklist.css';

// Default data simulating blacklist entries
const defaultBlacklist = [
    {
        id: 1,
        nom_entreprise_post: "Example Company",
        nom_entreprise_fraud: "Fraud Co.",
        raison: "Fraudulent activity",
        preuve_file: "proof1.jpg",
        post_date: "2025-01-15",
    },
    {
        id: 2,
        nom_entreprise_post: "Example Company",
        nom_entreprise_fraud: "Scam Inc.",
        raison: "Non-compliance",
        preuve_file: "proof2.pdf",
        post_date: "2025-02-20",
    },
    {
        id: 3,
        nom_entreprise_post: "Example Company",
        nom_entreprise_fraud: "Fake Ltd.",
        raison: "Misrepresentation",
        preuve_file: "",
        post_date: "2025-03-10",
    },
];

// Simulated logged-in user
// eslint-disable-next-line no-unused-vars
const loggedInUser = {
    user_id: 1,
    username: "Example Company",
};

const MyBlacklist = () => {
    const getProofLink = (file) => {
        if (!file) return "Aucune preuve";

        const fileExtension = file.split('.').pop().toLowerCase();
        const filePath = `uploads/${file}`;

        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            return (
                <a href={filePath} target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-images text-dark fs-3"></i>
                </a>
            );
        } else if (fileExtension === 'pdf') {
            return (
                <a href={filePath} target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-file-earmark-pdf text-danger fs-3"></i>
                </a>
            );
        } else {
            return (
                <a href={filePath} download>
                    <i className="bi bi-download text-dark fs-3"></i>
                </a>
            );
        }
    };

    return (
      
                    <main>
                        <div className="container-fluid px-4">
                            <h1 className="mt-4">My Blacklist</h1>
                            <ol className="breadcrumb mb-4">
                                <li className="breadcrumb-item">
                                    <a href="#">Dashboard</a>
                                </li>
                                <li className="breadcrumb-item active">My Blacklist</li>
                            </ol>
                            <div className="card mb-4">
                                <div className="card-body">
                                    <table id="datatablesSimple">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Signalé par</th>
                                                <th>Nom de l'entreprise frauduleuse</th>
                                                <th>Raison</th>
                                                <th>Preuve</th>
                                                <th>Date de publication</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {defaultBlacklist.map((entry) => (
                                                <tr key={entry.id}>
                                                    <td>{entry.id}</td>
                                                    <td>{entry.nom_entreprise_post}</td>
                                                    <td>{entry.nom_entreprise_fraud}</td>
                                                    <td>{entry.raison}</td>
                                                    <td>{getProofLink(entry.preuve_file)}</td>
                                                    <td>{entry.post_date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </main>
                   
    );
};

export default MyBlacklist;