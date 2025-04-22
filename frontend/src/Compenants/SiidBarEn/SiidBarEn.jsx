import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SiidBarEn.css';
function SiidBarEn() {
  const [openSections, setOpenSections] = useState({
      reclamations: false,
      techniciens: false,
      entreprises: false,
      Blacklist:false

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
            <Link to="/" className="menu-item">
              <i className="icon fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </Link>
          </div>
  
          {/* Section Reclamation */}
          <div className="menu-section">
            <h2 className="section-title">Reclamation</h2>
            <div 
              className={`menu-item ${openSections.reclamations ? 'active' : ''}`}
              onClick={() => toggleSection('reclamations')}
            >
              <i className="icon fas fa-building"></i>
              <span>Gestion des reclamations</span>
              <i className={`arrow fas fa-angle-${openSections.reclamations ? 'down' : 'right'}`}></i>
            </div>
            
            <div className={`submenu ${openSections.reclamations ? 'open' : ''}`}>
              <Link to="/reclamations/ajouter" className="submenu-item">
                <i className="submenu-icon fas fa-check-circle"></i>
                Ajouter Réclamation
              </Link>
              <Link to="/reclamations/listsreclamation" className="submenu-item">
                <i className="submenu-icon fas fa-search"></i>
                Réclamations 
              </Link>
              <Link to="/reclamations/listsrefuser" className="submenu-item">
                <i className="submenu-icon fas fa-plus-circle"></i>
                Réclamations refuser
              </Link>
            </div>
          </div>
  
          {/* Section technicien*/}
          <div className="menu-section">
            <h2 className="section-title">Technicien</h2>
            <div 
              className={`menu-item ${openSections.techniciens ? 'active' : ''}`}
              onClick={() => toggleSection('techniciens')}
            >
              <i className="icon fas fa-box-open"></i>
              <span>Gestion des techniciens</span>
              <i className={`arrow fas fa-angle-${openSections.techniciens ? 'down' : 'right'}`}></i>
            </div>
            
            <div className={`submenu ${openSections.techniciens ? 'open' : ''}`}>
              <Link to="/techniciens/ajouter" className="submenu-item">
                <i className="submenu-icon fas fa-list"></i>
                Ajouter Techniciens
              </Link>
              <Link to="/techniciens/liststechnicien" className="submenu-item">
                <i className="submenu-icon fas fa-tags"></i>
                Liste des Techniciens
              </Link>
              <Link to="/techniciens/cherchertechnicien" className="submenu-item">
                <i className="submenu-icon fas fa-tags"></i>
                Chercher  techniciens
              </Link>
            </div>
          </div>
          {/* Section entreprise */}
          <div className="menu-section">
            <h2 className="section-title">Gestion entreprise</h2>
            <Link to="/entreprise/chercherentreprise" className="menu-item">
              <i className="icon fas fa-chart-bar"></i>
              <span>Chercher Entreprises</span>
            </Link>
          </div>
          <div className="menu-section">
            <h2 className="section-title"></h2>
            <div 
              className={`menu-item ${openSections.Blacklist ? 'active' : ''}`}
              onClick={() => toggleSection('Blacklist')} >
              <i className="icon fas fa-building"></i>
              <span>Blacklist</span>
              <i className={`arrow fas fa-angle-${openSections.Blacklist ? 'down' : 'right'}`}></i>
            </div>
            <div className={`submenu ${openSections.Blacklist ? 'open' : ''}`}>
              <Link to="/entreprise/myblacklist" className="submenu-item">
                <i className="submenu-icon fas fa-search"></i>
                MyBlacklist 
              </Link>
              <Link to="/blacklist" className="submenu-item">
                <i className="submenu-icon fas fa-plus-circle"></i>
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
  };

export default SiidBarEn;