import React, { useState, useEffect } from 'react';
import './NavbarAd.css';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';

const NavbarAd = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        role: ''
    });

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/api/user');
                setUserData({
                    username: response.data.username || response.data.name,
                    role: response.data.role
                });
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                // If unauthorized, redirect to login
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            // Make logout request to backend
            await api.post('/logout');
            
            // Clear local storage and state
            localStorage.removeItem('authToken');
            setUserData({ username: '', role: '' });
            
            // Redirect to login page
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Force logout even if API fails
            localStorage.removeItem('authToken');
            navigate('/login');
        }
    };

    return (
        <div className="navbar-ad-container">
            <nav className="sb-topnav navbar navbar-expand navbar-dark fixed-top">
                <Link className="navbar-brand ps-3" to="/home">
                    Blacklist.en
                </Link>

                <button 
                    className="btn btn-link btn-sm order-1 order-lg-0" 
                    id="sidebarToggle"
                    onClick={toggleSidebar}
                    aria-label="Toggle navigation"
                >
                    <i className="fas fa-bars"></i>
                </button>

                <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                    <div className="input-group" style={{ width: '250px' }}>
                        <input
                            className="form-control border-end-0 py-2"
                            type="text"
                            placeholder="Rechercher..."
                            aria-label="Rechercher"
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
                        >
                            <i className="fas fa-user-circle fa-fw me-1"></i>
                            <span className="d-none d-lg-inline">
                                {userData.username || 'Utilisateur'}
                            </span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="navbarDropdown">
                            <li>
                                <Link className="dropdown-item" to="/profile">
                                    <i className="fas fa-user me-2"></i>Profil
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" to="/settings">
                                    <i className="fas fa-cog me-2"></i>Paramètres
                                </Link>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button 
                                    type="button" 
                                    className="dropdown-item text-danger" 
                                    onClick={handleLogout}
                                >
                                    <i className="fas fa-sign-out-alt me-2"></i>Déconnexion
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