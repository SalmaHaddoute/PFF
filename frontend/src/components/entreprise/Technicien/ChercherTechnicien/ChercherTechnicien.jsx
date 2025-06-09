import React, { useState, useEffect } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChercherTechnicien = () => {
  const API_BASE_URL = 'http://localhost:8000/api';
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [techniciens, setTechniciens] = useState([]);
  const [filteredTechniciens, setFilteredTechniciens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Récupérer tous les techniciens au chargement
  useEffect(() => {
    const fetchTechniciens = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/entreprise/techniciens`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data.success) {
          setTechniciens(response.data.data);
          setFilteredTechniciens(response.data.data);
        }
      } catch (err) {
        setError("Erreur lors du chargement des techniciens");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTechniciens();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm) {
      setFilteredTechniciens(techniciens);
      return;
    }

    try {
      // Option 1: Filtrage côté client
      if (!filterType) {
        const filtered = techniciens.filter(technicien => 
          Object.values(technicien).some(
            val => val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        setFilteredTechniciens(filtered);
        return;
      }

      // Option 2: Filtrage côté serveur (plus efficace)
      const response = await axios.get(`${API_BASE_URL}/entreprise/techniciens/search`, {
        params: {
          [filterType]: searchTerm
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setFilteredTechniciens(response.data.data);
      }
    } catch (err) {
      setError("Erreur lors de la recherche");
      console.error(err);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilterType("");
    setFilteredTechniciens(techniciens);
  };

  if (loading) {
    return <div className="text-center my-5">Chargement en cours...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

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
                          className="form-control"
                          placeholder="Rechercher par nom, CIN, adresse..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                          className="form-control"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                        >
                          <option value="">Tous les champs</option>
                          <option value="nom">Nom</option>
                          <option value="cin">CIN</option>
                          <option value="adresse">Adresse</option>
                          <option value="email">Email</option>
                          <option value="telephone">Téléphone</option>
                        </select>
                        <button type="submit" className="btn btn-warning">
                          <i className="fas fa-search"></i> Rechercher
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary ms-2"
                          onClick={handleClear}
                        >
                          Réinitialiser
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
                      <th>Secteur</th>
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
                          <td>{technicien.secteur_nom || 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">Aucun technicien trouvé</td>
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