import React, { useState } from "react";

// Default data simulating database query
const defaultTechniciens = [
  {
    id: 1,
    cin: "CIN123",
    nom: "John Doe",
    adresse: "123 Rue Example",
    email: "john.doe@example.com",
    telephone: "1234567890",
    username: "Example Company",
  },
  {
    id: 2,
    cin: "CIN456",
    nom: "Jane Smith",
    adresse: "456 Avenue Test",
    email: "jane.smith@example.com",
    telephone: "0987654321",
    username: "Test Enterprise",
  },
];

// Simulated logged-in user
// eslint-disable-next-line no-unused-vars
const loggedInUser = {
  user_id: 1,
  username: "Example Company",
  user_type: "entreprise",
};

const ChercherTechnicien = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filteredTechniciens, setFilteredTechniciens] =
    useState(defaultTechniciens);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm || !filterType) return;

    const filtered = defaultTechniciens.filter((technicien) => {
      const value = technicien[filterType]?.toLowerCase() || "";
      return value.includes(searchTerm.toLowerCase());
    });

    setFilteredTechniciens(filtered);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilterType("");
    setFilteredTechniciens(defaultTechniciens);
  };

  return (
    <main>
      <div className="page-content page-container">
        <div className="container-fluid px-4 my-3">
          <ol className="breadcrumb mb-2 text-light p-3 rounded shadow-sm">
            <li className="breadcrumb-item">
              <a href="#" className="text-warning">
                Dashboard
              </a>
            </li>
            <li className="breadcrumb-item active text-light-dark">
              Chercher Technicien
            </li>
          </ol>

          <div className="col-lg-90 grid-margin stretch-card my-3">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-7">
                    <form onSubmit={handleSearch}>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          name="search"
                          className="form-control"
                          placeholder="Search by Name, CIN, Address or Telephone"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          required
                        />
                        <select
                          name="filter"
                          className="form-control"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          required
                        >
                          <option value="">Select Filter</option>
                          <option value="username">Nom Entreprise</option>
                          <option value="cin">CIN</option>
                          <option value="adresse">Adresse</option>
                        </select>
                        <button type="submit" className="btn btn-warning">
                          <i className="fas fa-filter"></i> Filter
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary ms-2"
                          onClick={handleClear}
                        >
                          Clear
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>CIN</th>
                      <th>Nom</th>
                      <th>Adresse</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Nom Entreprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTechniciens.length > 0 ? (
                      filteredTechniciens.map((technicien) => (
                        <tr key={technicien.id}>
                          <td>{technicien.id}</td>
                          <td>{technicien.cin}</td>
                          <td>{technicien.nom}</td>
                          <td>{technicien.adresse}</td>
                          <td>{technicien.email}</td>
                          <td>{technicien.telephone}</td>
                          <td>{technicien.username}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7">Aucun technicien trouvé</td>
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

export default ChercherTechnicien;
