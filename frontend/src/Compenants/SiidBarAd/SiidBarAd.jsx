import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SiidBarAd.css';

const SiidBarAd = () => {
  const [openSections, setOpenSections] = useState({
    entreprises: false,
    produits: false,
    reclamations: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        {/* Section CORE */}
        <div className="menu-section">
          <h2 className="section-title">CORE</h2>
          <Link to="/admin/dashboard" className="menu-item">
            <i className="icon fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Section ENTREPRISE */}
        <div className="menu-section">
          <h2 className="section-title">ENTREPRISE</h2>
          <div 
            className={`menu-item ${openSections.entreprises ? 'active' : ''}`}
            onClick={() => toggleSection('entreprises')}
          >
            <i className="icon fas fa-building"></i>
            <span>Gestion des entreprises</span>
            <i className={`arrow fas fa-angle-${openSections.entreprises ? 'down' : 'right'}`}></i>
          </div>
          
          <div className={`submenu ${openSections.entreprises ? 'open' : ''}`}>
            <Link to="/admin/entreprises/verifier" className="submenu-item">
              <i className="submenu-icon fas fa-check-circle"></i>
              Vérifier Entreprise
            </Link>
            <Link to="/admin/entreprises/chercher" className="submenu-item">
              <i className="submenu-icon fas fa-search"></i>
              Chercher Entreprise
            </Link>
            <Link to="/admin/entreprises/secteurs" className="submenu-item">
              <i className="submenu-icon fas fa-plus-circle"></i>
              Ajouter Secteur
            </Link>
          </div>
        </div>

        {/* Section PRODUIT */}
        <div className="menu-section">
          <h2 className="section-title">PRODUIT</h2>
          <div 
            className={`menu-item ${openSections.produits ? 'active' : ''}`}
            onClick={() => toggleSection('produits')}
          >
            <i className="icon fas fa-box-open"></i>
            <span>Gestion des produits</span>
            <i className={`arrow fas fa-angle-${openSections.produits ? 'down' : 'right'}`}></i>
          </div>
          
          <div className={`submenu ${openSections.produits ? 'open' : ''}`}>
            <Link to="/admin/produits/liste" className="submenu-item">
              <i className="submenu-icon fas fa-list"></i>
              Liste des Produits
            </Link>
            <Link to="/admin/produits/types" className="submenu-item">
              <i className="submenu-icon fas fa-tags"></i>
              Ajouter Type
            </Link>
          </div>
        </div>

        {/* Section RÉCLAMATIONS */}
        <div className="menu-section">
          <h2 className="section-title">RÉCLAMATIONS</h2>
          <div 
            className={`menu-item ${openSections.reclamations ? 'active' : ''}`}
            onClick={() => toggleSection('reclamations')}
          >
            <i className="icon fas fa-exclamation-circle"></i>
            <span>Vérifier réclamations</span>
            <i className={`arrow fas fa-angle-${openSections.reclamations ? 'down' : 'right'}`}></i>
          </div>
          
          <div className={`submenu ${openSections.reclamations ? 'open' : ''}`}>
            <Link to="/admin/reclamations/en-cours" className="submenu-item">
              <i className="submenu-icon fas fa-hourglass-half"></i>
              Réclamations en cours
            </Link>
            <Link to="/admin/reclamations/historique" className="submenu-item">
              <i className="submenu-icon fas fa-history"></i>
              Historique
            </Link>
          </div>
        </div>

        {/* Section STATISTIQUES */}
        <div className="menu-section">
          <h2 className="section-title">STATISTIQUES</h2>
          <Link to="/admin/statistiques" className="menu-item">
            <i className="icon fas fa-chart-bar"></i>
            <span>Statistiques</span>
          </Link>
        </div>

        {/* Section BLACKLIST */}
        <div className="menu-section">
          <h2 className="section-title">BLACKLIST</h2>
          <Link to="/admin/blacklist" className="menu-item">
            <i className="icon fas fa-ban"></i>
            <span>Blacklist Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SiidBarAd;