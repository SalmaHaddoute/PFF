import React, { useEffect, useState } from 'react';
import './NavbarAd.css';

const NavbarAd = ({ toggleSidebar }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Récupérer les données utilisateur depuis le localStorage
        const userData = localStorage.getItem('user_data');
        if (userData) {
            setCurrentUser(JSON.parse(userData));
        }

        // Initialiser les dropdowns Bootstrap manuellement
        const initDropdowns = () => {
            const dropdownElements = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
            dropdownElements.map(function (dropdownToggleEl) {
                return new window.bootstrap.Dropdown(dropdownToggleEl);
            });
        };

        // Vérifier si Bootstrap est chargé
        if (typeof window.bootstrap !== 'undefined') {
            initDropdowns();
        } else {
            // Si Bootstrap n'est pas encore chargé, attendre qu'il le soit
            const checkBootstrap = setInterval(() => {
                if (typeof window.bootstrap !== 'undefined') {
                    initDropdowns();
                    clearInterval(checkBootstrap);
                }
            }, 100);
        }
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('user_data');
        window.location.href = '/login';
    };

    const getUserDisplayName = () => {
        if (!currentUser) return 'Utilisateur';
        if (currentUser.nom) return currentUser.nom;
        if (currentUser.nom_entreprise) return currentUser.nom_entreprise;
        return currentUser.email.split('@')[0];
    };

    return (
        <div className="navbar-ad-container">
            <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark fixed-top">
                <a className="navbar-brand ps-3" href="/home">
                    Blacklist.en
                </a>

                <button 
                    className="btn btn-link btn-sm order-1 order-lg-0" 
                    id="sidebarToggle"
                    onClick={toggleSidebar}
                >
                    <i className="fas fa-bars"></i>
                </button>

                <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                    <div className="input-group" style={{ width: '250px' }}>
                        <input
                            className="form-control border-end-0 py-2"
                            type="text"
                            placeholder="Search for..."
                            aria-label="Search"
                        />
                        <button className="btn btn-warning border-start-0 py-2" type="submit">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </form>

                <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                    <li className="nav-item dropdown">
                        <a 
                            className="nav-link dropdown-toggle" 
                            id="navbarDropdown" 
                            href="#" 
                            role="button" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                            onClick={(e) => e.preventDefault()}
                        >
                            <i className="fas fa-user-circle fa-fw me-1"></i>
                            <span className="d-none d-lg-inline">{getUserDisplayName()}</span>
                        </a>
                        <ul 
                            className="dropdown-menu dropdown-menu-end shadow" 
                            aria-labelledby="navbarDropdown"
                        >
                            <li><a className="dropdown-item" href="#"><i className="fas fa-user"></i>Profil</a></li>
                            <li><a className="dropdown-item" href="#"><i className="fas fa-cog"></i>Paramètres</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button type="button" className="dropdown-item text-danger" onClick={handleLogout}>
                                    <i className="fas fa-sign-out-alt"></i>Déconnexion
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default NavbarAd;