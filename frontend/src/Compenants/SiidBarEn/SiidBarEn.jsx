import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SiidBarEn.css';

function SiidBarEn() {
  const [openSections, setOpenSections] = useState({
    reclamations: false,
    techniciens: false,
    Blacklist: false
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
          <Link to="/entreprise/dashboard" className="menu-item">
            <i className="icon fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Section RECLAMATION */}
        <div className="menu-section">
          <h2 className="section-title">RECLAMATION</h2>
          <div 
            className={`menu-item ${openSections.reclamations ? 'active' : ''}`}
            onClick={() => toggleSection('reclamations')}
          >
            <i className="icon fas fa-exclamation-circle"></i>
            <span>Gestion des réclamations</span>
            <i className={`arrow fas fa-angle-${openSections.reclamations ? 'down' : 'right'}`}></i>
          </div>
          
          <div className={`submenu ${openSections.reclamations ? 'open' : ''}`}>
            <Link to="/entreprise/reclamations/ajouter" className="submenu-item">
              <i className="submenu-icon fas fa-plus-circle"></i>
              Ajouter Réclamation
            </Link>
            <Link to="/entreprise/reclamations/liste" className="submenu-item">
              <i className="submenu-icon fas fa-list"></i>
              Liste des Réclamations
            </Link>
            <Link to="/entreprise/reclamations/refusees" className="submenu-item">
              <i className="submenu-icon fas fa-times-circle"></i>
              Réclamations refusées
            </Link>
          </div>
        </div>

        {/* Section TECHNICIEN */}
        <div className="menu-section">
          <h2 className="section-title">TECHNICIEN</h2>
          <div 
            className={`menu-item ${openSections.techniciens ? 'active' : ''}`}
            onClick={() => toggleSection('techniciens')}
          >
            <i className="icon fas fa-user-cog"></i>
            <span>Gestion des techniciens</span>
            <i className={`arrow fas fa-angle-${openSections.techniciens ? 'down' : 'right'}`}></i>
          </div>
          
          <div className={`submenu ${openSections.techniciens ? 'open' : ''}`}>
            <Link to="/entreprise/techniciens/ajouter" className="submenu-item">
              <i className="submenu-icon fas fa-user-plus"></i>
              Ajouter Technicien
            </Link>
            <Link to="/entreprise/techniciens/liste" className="submenu-item">
              <i className="submenu-icon fas fa-users"></i>
              Liste des Techniciens
            </Link>
            <Link to="/entreprise/techniciens/chercher" className="submenu-item">
              <i className="submenu-icon fas fa-search"></i>
              Chercher Technicien
            </Link>
          </div>
        </div>

        {/* Section ENTREPRISE */}
        <div className="menu-section">
          <h2 className="section-title">ENTREPRISE</h2>
          <Link to="/entreprise/entreprises/chercher" className="menu-item">
            <i className="icon fas fa-search"></i>
            <span>Chercher Entreprises</span>
          </Link>
        </div>

        {/* Section BLACKLIST */}
        <div className="menu-section">
          <h2 className="section-title">BLACKLIST</h2>
          <div 
            className={`menu-item ${openSections.Blacklist ? 'active' : ''}`}
            onClick={() => toggleSection('Blacklist')}
          >
            <i className="icon fas fa-ban"></i>
            <span>Gestion Blacklist</span>
            <i className={`arrow fas fa-angle-${openSections.Blacklist ? 'down' : 'right'}`}></i>
          </div>
          
          <div className={`submenu ${openSections.Blacklist ? 'open' : ''}`}>
            <Link to="/entreprise/blacklist/mon-liste" className="submenu-item">
              <i className="submenu-icon fas fa-list"></i>
              Ma Blacklist
            </Link>
            <Link to="/entreprise/blacklist/directory" className="submenu-item">
              <i className="submenu-icon fas fa-book"></i>
              Blacklist Directory
            </Link>
          </div>
        </div>

        {/* Section STATISTIQUES */}
        <div className="menu-section">
          <h2 className="section-title">STATISTIQUES</h2>
          <Link to="/entreprise/statistiques" className="menu-item">
            <i className="icon fas fa-chart-bar"></i>
            <span>Statistiques</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SiidBarEn;