/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { FaUserCircle, FaEnvelope, FaCalendarAlt, FaCheck, FaTimes, FaDatabase } from 'react-icons/fa';
import axios from 'axios';
import 'simple-datatables/dist/style.css';

const VerifierEntreprise = () => {
  const defaultEntreprises = [
    {
      id: 61,
      ice: '00',
      rc: '00',
      username: 'salma',
      email: 'salma@gmail.com',
      address: 'maroc',
      secteur: { nom: 'Services' },
      status: null,
      created_at: '2025-04-09T19:03:00',
    },
    {
      id: 60,
      ice: '11',
      rc: '11',
      username: 'sanaa',
      email: 'sanaa@gmail.com',
      address: '71233-6199',
      secteur: { nom: 'Bâtiment' },
      status: 'accepté',
      created_at: '2025-04-09T18:40:00',
    },
    {
      id: 59,
      ice: '777',
      rc: '777',
      username: 'ouissal',
      email: 'ouissal@gmail.com',
      address: 'maroc',
      secteur: { nom: 'Commerce' },
      status: 'refusé',
      created_at: '2025-04-08T22:21:00',
    },
  ];

  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const API_BASE_URL = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/entreprises`);
        setEntreprises(response.data);
      } catch (error) {
        console.error('Error fetching enterprises:', error);
        console.error('Error details:', error.response?.data || error.message);
        showAlert('Échec du chargement des entreprises. Vérifiez la console pour plus de détails.', 'danger');
        setEntreprises(defaultEntreprises);
      } finally {
        setLoading(false);
      }
    };

    fetchEntreprises();
  }, []);

  const handleStatusUpdate = async (entrepriseId, status) => {
    if (window.confirm(`Voulez-vous vraiment ${status} cette entreprise?`)) {
      try {
        setLoading(true);
        const response = await axios.put(`${API_BASE_URL}/entreprises/${entrepriseId}/status`, {
          status,
        });

        setEntreprises((prev) =>
          prev.map((entreprise) =>
            entreprise.id === entrepriseId
              ? { ...entreprise, status: response.data.entreprise.status }
              : entreprise
          )
        );

        showAlert(`Entreprise ${status} avec succès`, 'success');
      } catch (error) {
        console.error('Error updating status:', error);
        console.error('Error details:', error.response?.data || error.message);
        showAlert('Échec de la mise à jour du statut. Vérifiez la console pour plus de détails.', 'danger');
      } finally {
        setLoading(false);
      }
    }
  };

  const showAlert = (message, variant) => {
    setAlert({ message, variant });
    setTimeout(() => setAlert(null), 5000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepté':
        return 'success';
      case 'refusé':
        return 'danger';
      case 'excepto':
        return 'info';
      default:
        return 'warning';
    }
  };

  return (
    <div className="container-fluid px-0" style={{ maxWidth: '100%' }}>
      <h4 className="mb-3 px-3">Liste des Entreprises</h4>
      <div className="d-flex justify-content-between align-items-center mb-3 px-3">
        <div className="d-flex align-items-center">
          <span className="me-2">10</span>
          <select className="form-select form-select-sm" style={{ width: 'auto' }}>
            <option>entrées par page</option>
            <option>5</option>
            <option>10</option>
            <option>15</option>
            <option>20</option>
          </select>
        </div>
      </div>
      {alert && (
        <Alert
          variant={alert.variant}
          dismissible
          className="position-fixed top-0 start-50 translate-middle-x m-3"
          style={{ zIndex: 9999, maxWidth: '90%' }}
          onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body p-0" style={{ overflowX: 'auto' }}>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <table className="table table-hover align-middle mb-0" style={{ minWidth: '100%' }}>
              <thead className="bg-light">
                <tr>
                  <th>ID</th>
                  <th>ICE</th>
                  <th>RC</th>
                  <th>Nom d'utilisateur</th>
                  <th>Email</th>
                  <th>Adresse</th>
                  <th>Secteur</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entreprises.length > 0 ? (
                  entreprises.map((entreprise) => (
                    <tr key={entreprise.id}>
                      <td>{entreprise.id}</td>
                      <td>{entreprise.ice || '-'}</td>
                      <td>{entreprise.rc || '-'}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaUserCircle className="me-2 text-secondary" />
                          {entreprise.username || entreprise.name || '-'}
                        </div>
                      </td>
                      <td>
                        <FaEnvelope className="me-2 text-primary" />
                        {entreprise.email || '-'}
                      </td>
                      <td>{entreprise.address || '-'}</td>
                      <td>{entreprise.secteur?.nom || '-'}</td>
                      <td>
                        <Badge
                          pill
                          bg={getStatusBadge(entreprise.status)}
                          className={!entreprise.status || entreprise.status === 'pending' ? 'bg-transparent border border-warning text-warning' : ''}
                        >
                          {entreprise.status === 'pending' || !entreprise.status ? 'En attente' : entreprise.status.charAt(0).toUpperCase() + entreprise.status.slice(1)}
                        </Badge>
                      </td>
                      <td>
                        {new Date(entreprise.created_at).toLocaleString('fr-FR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant={!entreprise.status || entreprise.status === 'pending' ? 'outline-success' : 'outline-secondary'}
                            disabled={entreprise.status && entreprise.status !== 'pending' || loading}
                            onClick={() => handleStatusUpdate(entreprise.id, 'accepté')}
                            size="sm"
                            className="p-1"
                          >
                            <FaCheck />
                          </Button>
                          <Button
                            variant={!entreprise.status || entreprise.status === 'pending' ? 'outline-danger' : 'outline-secondary'}
                            disabled={entreprise.status && entreprise.status !== 'pending' || loading}
                            onClick={() => handleStatusUpdate(entreprise.id, 'refusé')}
                            size="sm"
                            className="p-1"
                          >
                            <FaTimes />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      <FaDatabase className="fa-2x text-muted mb-2" />
                      <p className="text-muted">Aucune entreprise à afficher</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="text-muted px-3">
        Affichage de 1 à {entreprises.length} sur {entreprises.length} entreprises
      </div>
    </div>
  );
};

export default VerifierEntreprise;