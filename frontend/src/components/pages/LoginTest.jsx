import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      // Remember to use motdepasse instead of password for the backend
      const response = await login(email.trim(), password.trim());
      
      if (response.status === 'authenticated') {
        navigate(response.user_type === 'admin' ? '/admin' : '/entreprise/dashboard');
      } else {
        navigate('/account-status', { 
          state: { 
            message: response.message,
            status: response.status
          }
        });
      }
    } catch (error) {
      console.error('Login test error:', error);
      setErrorMessage(error.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login Test Page</h2>
      <p className="mb-4">This is a simplified login test page</p>
      
      {errorMessage && (
        <div className="alert alert-danger">{errorMessage}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      
      <div className="mt-3">
        <Link to="/login">Go to main login page</Link>
      </div>
    </div>
  );
};

export default LoginTest;
