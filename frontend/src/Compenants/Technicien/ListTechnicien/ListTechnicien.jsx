import React, { useState } from "react";

// Default data simulating database query
const defaultTechniciens = [
  {
    id: 1,
    cin: "AB123456",
    nom: "Jean Dupont",
    adresse: "123 Rue Principale, Paris",
    email: "jean.dupont@example.com",
    telephone: "0123456789",
    secteur_nom: "Informatique",
    entreprise_nom: "Entreprise A",
  },
  {
    id: 2,
    cin: "CD789012",
    nom: "Marie Martin",
    adresse: "456 Avenue Liberté, Lyon",
    email: "marie.martin@example.com",
    telephone: "0987654321",
    secteur_nom: "Électronique",
    entreprise_nom: "Entreprise B",
  },
  {
    id: 3,
    cin: "EF345678",
    nom: "Pierre Dubois",
    adresse: "789 Boulevard Égalité, Marseille",
    email: "pierre.dubois@example.com",
    telephone: "0234567890",
    secteur_nom: "Mécanique",
    entreprise_nom: "Entreprise A",
  },
];

// Simulated logged-in user
// const loggedInUser = {
//     username: 'Entreprise A',
//     user_id: 1
// };

// Simulated session messages
// eslint-disable-next-line no-unused-vars
const sessionMessages = {
  message: "Technicien mis à jour avec succès !", // Example success message
  // error: 'Erreur lors de la suppression.', // Uncomment for error example
};

const ListTechnicien = () => {
  const [techniciens, setTechniciens] = useState(defaultTechniciens);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (technicien) => {
    setEditingId(technicien.id);
    setEditForm({
      cin: technicien.cin,
      nom: technicien.nom,
      adresse: technicien.adresse,
      email: technicien.email,
      telephone: technicien.telephone,
    });
  };

  const handleSave = (id) => {
    const updatedTechniciens = techniciens.map((technicien) =>
      technicien.id === id ? { ...technicien, ...editForm } : technicien
    );
    setTechniciens(updatedTechniciens);
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce technicien ?")) {
      setTechniciens(techniciens.filter((technicien) => technicien.id !== id));
    }
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  return (
    <main>
      <div className="container-fluid px-4 my-3">
        <ol className="breadcrumb mb-4 text-light p-3 rounded shadow-sm">
          <li className="breadcrumb-item">
            <a href="#" className="text-warning">
              Dashboard
            </a>
          </li>
          <li className="breadcrumb-item active text-light-dark">
            Listes Techniciens
          </li>
        </ol>
        {/* {sessionMessages.message && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center mx-auto w-1/2 mt-4">
                            {sessionMessages.message}
                        </div>
                    )}
                    {sessionMessages.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center mx-auto w-1/2 mt-4">
                            {sessionMessages.error}
                        </div>
                    )} */}
        <div className="col-lg-12 grid-margin stretch-card my-3">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr className="text-sm uppercase text-gray-600 bg-gray-100">
                      <th className="p-4">ID</th>
                      <th className="p-4">CIN</th>
                      <th className="p-4">Nom</th>
                      <th className="p-4">Adresse</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Téléphone</th>
                      <th className="p-4">Secteur</th>
                      <th className="p-4">Entreprise</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {techniciens.length > 0 ? (
                      techniciens.map((technicien) => (
                        <tr key={technicien.id} className="border-t">
                          <td className="p-4">{technicien.id}</td>
                          <td className="p-4">
                            {editingId === technicien.id ? (
                              <input
                                type="text"
                                name="cin"
                                value={editForm.cin || ""}
                                onChange={handleInputChange}
                                className="border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 px-2 py-1 w-full"
                              />
                            ) : (
                              technicien.cin
                            )}
                          </td>
                          <td className="p-4">
                            {editingId === technicien.id ? (
                              <input
                                type="text"
                                name="nom"
                                value={editForm.nom || ""}
                                onChange={handleInputChange}
                                className="border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 px-2 py-1 w-full"
                              />
                            ) : (
                              technicien.nom
                            )}
                          </td>
                          <td className="p-4">
                            {editingId === technicien.id ? (
                              <input
                                type="text"
                                name="adresse"
                                value={editForm.adresse || ""}
                                onChange={handleInputChange}
                                className="border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 px-2 py-1 w-full"
                              />
                            ) : (
                              technicien.adresse
                            )}
                          </td>
                          <td className="p-4">
                            {editingId === technicien.id ? (
                              <input
                                type="text"
                                name="email"
                                value={editForm.email || ""}
                                onChange={handleInputChange}
                                className="border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 px-2 py-1 w-full"
                              />
                            ) : (
                              technicien.email
                            )}
                          </td>
                          <td className="p-4">
                            {editingId === technicien.id ? (
                              <input
                                type="text"
                                name="telephone"
                                value={editForm.telephone || ""}
                                onChange={handleInputChange}
                                className="border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 px-2 py-1 w-full"
                              />
                            ) : (
                              technicien.telephone
                            )}
                          </td>
                          <td className="p-4">{technicien.secteur_nom}</td>
                          <td className="p-4">{technicien.entreprise_nom}</td>
                          <td className="p-4 flex justify-center space-x-2">
                            {editingId === technicien.id ? (
                              <button
                                onClick={() => handleSave(technicien.id)}
                                className="bg-success text-white px-2 py-1 mb-2 rounded"
                              >
                                <i className="bi bi-check"></i>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEdit(technicien)}
                                className="bg-black text-warning px-2 py-1 mb-2 rounded"
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(technicien.id)}
                              className="bg-warning text-black px-2 py-1 rounded "
                            >
                              <i className="bi bi-trash3"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="p-4 text-center">
                          Aucun technicien trouvé
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
    </main>
  );
};

export default ListTechnicien;
