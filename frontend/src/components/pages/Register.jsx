import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [formData, setFormData] = useState({
    ice: '',
    rc: '',
    username: '',
    email: '',
    address: '',
    id_secteur: '',
    password: '',
    agree: false
  });
  
  const [secteurs, setSecteurs] = useState([]);
  const [loading, setLoading] = useState({
    form: false,
    secteurs: true
  });
  
  const [errors, setErrors] = useState({
    form: null,
    secteurs: null
  });
  
  const navigate = useNavigate();

  // Base URL configuration
  const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  // Fetch sectors function wrapped in useCallback
  const fetchSecteurs = useCallback(async (retryCount = 0) => {
    try {
      // First get CSRF cookie
      await api.get('/sanctum/csrf-cookie');
      
      // Then fetch sectors
      const response = await api.get('/api/secteurs');

      if (!response.data) {
        throw new Error('Empty response from server');
      }

      const data = response.data;
      const sectorsArray = Array.isArray(data) ? data : 
                         (data?.secteurs ? data.secteurs : []);

      if (sectorsArray.length === 0) {
        throw new Error('No sectors available');
      }

      setSecteurs(sectorsArray);
      setErrors(prev => ({ ...prev, secteurs: null }));
    } catch (err) {
      console.error('Error fetching sectors:', {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });
      
      if (retryCount < 2) {
        setTimeout(() => fetchSecteurs(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }

      setErrors(prev => ({
        ...prev,
        secteurs: err.response?.data?.message || 
                'Failed to load sectors. Please try again later.'
      }));
    } finally {
      setLoading(prev => ({ ...prev, secteurs: false }));
    }
  }, [api]); // Dépendances pour useCallback

  // Fetch sectors on component mount
  useEffect(() => {
    fetchSecteurs();
  }, [fetchSecteurs]);  // Ajout de fetchSecteurs comme dépendance

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };



  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.ice || formData.ice.length < 5) {
      newErrors.ice = 'ICE must be at least 5 characters';
    }
    
    if (!formData.rc) {
      newErrors.rc = 'RC is required';
    }
    
    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Company name must be at least 3 characters';
    }
    
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.address) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.id_secteur) {
      newErrors.id_secteur = 'Please select a sector';
    }
    
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.agree) {
      newErrors.agree = 'You must accept the terms and conditions';
    }
    
    return newErrors;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(prev => ({ ...prev, form: formErrors }));
      return;
    }
    
    setLoading(prev => ({ ...prev, form: true }));
    setErrors(prev => ({ ...prev, form: null }));

    try {
      // Get CSRF cookie first
      await api.get('/sanctum/csrf-cookie');
      
      // Submit registration data to the enterprise-specific endpoint
      await api.post('/api/register-entreprise', {
        ice: formData.ice,
        rc: formData.rc,
        username: formData.username,
        email: formData.email,
        address: formData.address,
        id_secteur: formData.id_secteur,
        motdepasse: formData.password,
        date_creation: new Date().toISOString().split('T')[0] // Add current date
      });

     navigate('/statue-page', {
      state: {
        registrationSuccess: true,
        message: 'Registration successful! Your account is pending approval.'
      }
      });
    } catch (err) {
      console.error('Registration error:', {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });
      
      const errorMessage = err.response?.data?.message || 
                         Object.values(err.response?.data?.errors || {}).flat()[0] || 
                         "An error occurred during registration";
      setErrors(prev => ({ ...prev, form: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  return (
    
    <section className="py-4 py-md-5 py-xl-8">
      <div className="container ">
        <div className="row">
          <div className="col-12">
            <div className="mb-5">
              <h2 className="display-5 fw-bold text-center">Register</h2>
             <p className="text-center m-2 d-flex justify-content-center">
  Already have an account?{' '}
 <Link to="/login" className="nav-link text-warning">Connexion</Link>
</p>
            </div>
          </div>
        </div>
        
        <div className="row justify-content-center ">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="row gy-5 justify-content-center">
              <div className="col-12 col-lg-5">
                {errors.form && typeof errors.form === 'string' && (
                  <div className="alert alert-danger mb-4">
                    {errors.form}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row gy-3 overflow-hidden">
                    {/* ICE Field */}
                    <div className="col-12">
                      <div className="form-floating mb-2">
                        <input
                          type="text"
                          className={`form-control border-0 border-bottom rounded-0 ${errors.form?.ice ? 'is-invalid' : ''}`}
                          name="ice"
                          id="ice"
                          placeholder="ICE"
                          value={formData.ice}
                          onChange={handleChange}
                          required
                        />
                        <label>ICE</label>
                        {errors.form?.ice && <div className="invalid-feedback">{errors.form.ice}</div>}
                      </div>
                    </div>
                    
                    {/* RC Field */}
                    <div className="col-12">
                      <div className="form-floating mb-2">
                        <input
                          type="text"
                          className={`form-control border-0 border-bottom rounded-0 ${errors.form?.rc ? 'is-invalid' : ''}`}
                          name="rc"
                          id="rc"
                          placeholder="RC"
                          value={formData.rc}
                          onChange={handleChange}
                          required
                        />
                         <label>RC</label>
                        {errors.form?.rc && <div className="invalid-feedback">{errors.form.rc}</div>}
                      </div>
                    </div>
                    
                    {/* Username Field */}
                    <div className="col-12">
                      <div className="form-floating mb-2">
                        <input
                          type="text"
                          className={`form-control border-0 border-bottom rounded-0 ${errors.form?.username ? 'is-invalid' : ''}`}
                          name="username"
                          id="username"
                          placeholder="Company Name"
                          value={formData.username}
                          onChange={handleChange}
                          required
                        />
                         <label>USERNAME</label>
                        {errors.form?.username && <div className="invalid-feedback">{errors.form.username}</div>}
                      </div>
                    </div>
                    
                    {/* Email Field */}
                    <div className="col-12">
                      <div className="form-floating mb-2">
                        <input
                          type="email"
                          className={`form-control border-0 border-bottom rounded-0 ${errors.form?.email ? 'is-invalid' : ''}`}
                          name="email"
                          id="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <label>EMAIL</label>
                        {errors.form?.email && <div className="invalid-feedback">{errors.form.email}</div>}
                      </div>
                    </div>
                    
                    {/* Address Field */}
                    <div className="col-12">
                      <div className="form-floating mb-2">
                        <input
                          type="text"
                          className={`form-control border-0 border-bottom rounded-0 ${errors.form?.address ? 'is-invalid' : ''}`}
                          name="address"
                          id="address"
                          placeholder="Address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                        />
                        <label>ADDRESS</label>
                        {errors.form?.address && <div className="invalid-feedback">{errors.form.address}</div>}
                      </div>
                    </div>
                    
                    {/* Sector Selection */}
                    <div className="col-12 ">
                      
                      
                      {loading.secteurs ? (
                        <div className="d-flex align-items-center text-muted">
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Loading sectors...
                        </div>
                      ) : errors.secteurs ? (
                        <div className="alert alert-danger py-2">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          {errors.secteurs}
                          <button 
                            className="btn btn-sm btn-outline-danger ms-2"
                            onClick={() => {
                              setLoading(prev => ({ ...prev, secteurs: true }));
                              setErrors(prev => ({ ...prev, secteurs: null }));
                              fetchSecteurs();
                            }}
                          >
                            Retry
                          </button>
                        </div>
                      ) : (
                        <>
                        <div className="form-floating mb-2">
                          <select
                            className={`form-select border-0 border-bottom shadow-none bg-transparent ${errors.form?.id_secteur ? 'is-invalid' : ''}`}
                            name="id_secteur"
                            id="id_secteur"
                            value={formData.id_secteur}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select a sector</option>
                            {secteurs.map(secteur => (
                              <option key={`sect-${secteur.id}`} value={secteur.id}>
                                {secteur.nom}
                              </option>
                            ))}
                          </select>
                          {errors.form?.id_secteur && <div className="invalid-feedback">{errors.form.id_secteur}</div>}
                        </div></>
                      )}
                    </div>
                    
                    {/* Password Field */}
                    <div className="col-12">
                      <div className="form-floating mb-2">
                        <input
                          type="password"
                          className={`form-control border-0 border-bottom rounded-0 ${errors.form?.password ? 'is-invalid' : ''}`}
                          name="password"
                          id="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="password">Password</label>
                        {errors.form?.password && <div className="invalid-feedback">{errors.form.password}</div>}
                      </div>
                    </div>
                    
                    {/* Terms Checkbox - Professional Styling */}
<div className="col-12">
  <div className="form-check m-3">
    <input
      className={`form-check-input ${errors.form?.agree ? 'is-invalid' : ''}`}
      type="checkbox"
      name="agree"
      id="agree"
      checked={formData.agree}
      onChange={handleChange}
      style={{
        width: '1.2em',
        height: '1.2em',
        cursor: 'pointer',
        backgroundColor: formData.agree ? '#0d6efd' : 'white',
        borderColor: formData.agree ? '#0d6efd' : '#ced4da',
        borderRadius: '0.25em',
        transition: 'all 0.2s ease-in-out',
        boxShadow: formData.agree ? 'none' : 'inset 0 1px 2px rgba(0,0,0,0.1)',
        position: 'relative',
        appearance: 'none',
        WebkitAppearance: 'none'
      }}
    />
    {/* Custom checkmark */}
    {formData.agree && (
      <span 
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '0.5em',
          height: '0.9em',
          border: 'solid white',
          borderWidth: '0 0.15em 0.15em 0',
          transform: 'translate(-50%, -60%) rotate(45deg)',
          pointerEvents: 'none'
        }}
      />
    )}
    <label className="form-check-label text-secondary ms-2" htmlFor="agree" style={{ cursor: 'pointer' }}>
      I accept the{' '}
      <Link to="/terms" className="link-dark fw-bold text-decoration-none">
        terms and conditions
      </Link>
    </label>
    {errors.form?.agree && (
      <div className="invalid-feedback d-block">{errors.form.agree}</div>
    )}
  </div>
</div>
                    
                    {/* Submit Button */}
                    <div className="col-12">
                      <div className="d-grid">
                        <button
                          className="btn btn-lg btn-dark rounded-0 fs-6"
                          type="submit"
                          disabled={loading.form}
                        >
                          {loading.form ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Processing...
                            </>
                          ) : (
                            "Register"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;