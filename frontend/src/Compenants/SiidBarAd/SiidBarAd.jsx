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
          <Link to="/dashboard" className="menu-item">
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
            <Link to="/entreprises/verifier" className="submenu-item">
              <i className="submenu-icon fas fa-check-circle"></i>
              Vérifier Entreprise
            </Link>
            <Link to="/entreprises/chercher" className="submenu-item">
              <i className="submenu-icon fas fa-search"></i>
              Chercher Entreprise
            </Link>
            <Link to="/entreprises/secteurs" className="submenu-item">
              <i className="submenu-icon fas fa-plus-circle"></i>
              Ajouter Secteur
            </Link>
          </div>
        </div>

         {/* Section techniciens */}
        <div className="menu-section">
          <h2 className="section-title">technicien</h2>
          <div 
            className={`menu-item ${openSections.techniciens ? 'active' : ''}`}
            onClick={() => toggleSection('techniciens')}
          >
           <i className="submenu-icon fas fa-user-circle f-4"></i>

            <span>Gestion des techniciens</span>
            <i className={`arrow fas fa-angle-${openSections.techniciens ? 'down' : 'right'}`}></i>
          </div>
          
          <div className={`submenu ${openSections.techniciens ? 'open' : ''}`}>
            <Link to="/technicien/cherhcer" className="submenu-item">
             <i className="submenu-icon fas fa-search"></i>
             chercher technicien
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
            <Link to="/admin/verifier-reclamations" className="submenu-item">
              <i className="submenu-icon fas fa-hourglass-half"></i>
              Réclamations en cours
            </Link>
            <Link to="/reclamations/historique" className="submenu-item">
              <i className="submenu-icon fas fa-history"></i>
              Historique
            </Link>
          </div>
        </div>

        {/* Section STATISTIQUES */}
        <div className="menu-section">
          <h2 className="section-title">STATISTIQUES</h2>
          <Link to="/statistiques" className="menu-item">
            <i className="icon fas fa-chart-bar"></i>
            <span>Statistiques</span>
          </Link>
        </div>

        {/* Section BLACKLIST */}
        <div className="menu-section">
          <h2 className="section-title">BLACKLIST</h2>
          <Link to="/blacklist" className="menu-item">
            <i className="icon fas fa-ban"></i>
            <span>Blacklist Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SiidBarAd;