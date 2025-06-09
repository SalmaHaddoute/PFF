import React from 'react';
import './NavbarAd.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const NavbarAd = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const { user, logout: authLogout } = useAuth(); // Récupérer l'utilisateur connecté du contexte d'authentification

    const handleLogout = async (e) => {
        e.preventDefault();
        
        try {
            // Utiliser la fonction de déconnexion du contexte d'authentification si elle existe
            if (typeof authLogout === 'function') {
                await authLogout();
            } else {
                // Fallback: supprimer manuellement les données d'authentification
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                localStorage.removeItem('userType');
            }
            
            // Rediriger vers la page de connexion
            navigate('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion', error);
            // Rediriger vers la page de connexion même en cas d'erreur
            navigate('/login');
        }
    };

    return (
        <div className="navbar-ad-container">
            <nav className="sb-topnav navbar navbar-expand navbar-dark fixed-top">
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
                        <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fas fa-user-circle fa-fw me-1"></i>
                            <span className="d-none d-lg-inline">
                                {user ? (user.username || user.name || user.email || 'Utilisateur') : 'Utilisateur'}
                            </span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="navbarDropdown">
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