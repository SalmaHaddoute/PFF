import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import './Signup.css';
import axios from '../../api/api'; // Supprimez l'import axios en double

// Validation schema
const schema = yup.object().shape({
  username: yup.string().required('Le nom est requis'),
  email: yup.string().email('Email invalide').required('Email requis'),
  motdepasse: yup.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[a-z]/, 'Doit contenir une minuscule')
    .matches(/[A-Z]/, 'Doit contenir une majuscule')
    .matches(/[0-9]/, 'Doit contenir un chiffre')
    .matches(/[^a-zA-Z0-9]/, 'Doit contenir un caractère spécial')
    .required('Mot de passe requis'),
  rc: yup.string().length(8, 'RC doit contenir 8 caractères').required('RC requis'),
  ice: yup.string().length(15, 'ICE doit contenir 15 caractères').required('ICE requis'),
  id_secteur: yup.string().required('Secteur requis'),
  address: yup.string().required('Adresse requise')
});

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    motdepasse: '',
    rc: '',
    ice: '',
    id_secteur: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [secteurs, setSecteurs] = useState([]);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // Fetch secteurs on mount
  useEffect(() => {
    const fetchSecteurs = async () => {
      try {
        const response = await axios.get('/api/secteurs'); // Utilisez le chemin relatif
        
        if (response.data?.success && Array.isArray(response.data.data)) {
          setSecteurs(response.data.data);
        } else {
          throw new Error('Format de réponse inattendu');
        }
      } catch (error) {
        console.error('Erreur:', error);
        setAlert({
          message: 'Erreur lors du chargement des secteurs',
          type: 'danger'
        });
      }
    };
    fetchSecteurs();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrors({});
  setAlert({ message: '', type: '' });

  try {
    await schema.validate(formData, { abortEarly: false });
    
    const response = await axios.post('/api/register', formData);
    
    if (response.data.success) {
      setAlert({
        message: 'Inscription réussie! Redirection...',
        type: 'success'
      });
      setTimeout(() => navigate('/login'), 2000);
    }
  } catch (error) {
    if (error.response) {
      // Erreur du serveur
      console.error('Réponse erreur:', error.response);
      setAlert({
        message: error.response.data.message || 'Erreur serveur',
        type: 'danger'
      });
    } else if (error instanceof yup.ValidationError) {
      // Erreur de validation
      const newErrors = {};
      error.inner.forEach(err => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    } else {
      // Autres erreurs
      console.error('Erreur:', error);
      setAlert({
        message: 'Erreur réseau ou configuration',
        type: 'danger'
      });
    }
  } finally {
    setLoading(false);
  }
};
  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (formData.motdepasse.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.motdepasse)) strength += 1;
    if (/[0-9]/.test(formData.motdepasse)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.motdepasse)) strength += 1;
    setPasswordStrength(strength);
  }, [formData.motdepasse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  return (
    <section className="py-3 py-md-5 py-xl-8 bg-white">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-3">
            <h2 className="display-5  fw-bold">S'inscrire</h2>
            <p>
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="link-warning text-decoration-none">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="row gy-5 justify-content-center">
              <div className="col-12 col-lg-5">
                {alert.message && (
                  <div className={`alert alert-${alert.type} text-center`}>
                    {alert.message}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="row gy-3 overflow-hidden">
                    {[
                      { label: 'ICE (15 caractères)', name: 'ice', type: 'text' },
                      { label: 'RC (8 caractères)', name: 'rc', type: 'text' },
                      { label: 'Nom Entreprise', name: 'username', type: 'text' },
                      { label: 'Email', name: 'email', type: 'email' },
                      { label: 'Adresse', name: 'address', type: 'text' },
                      { 
                        label: 'Mot de passe', 
                        name: 'motdepasse', 
                        type: 'password',
                        help: (
                          <div className="mt-2">
                            <div className="progress" style={{ height: '5px' }}>
                              <div 
                                className={`progress-bar ${
                                  passwordStrength === 0 ? 'bg-danger' :
                                  passwordStrength === 1 ? 'bg-danger' :
                                  passwordStrength === 2 ? 'bg-warning' :
                                  passwordStrength === 3 ? 'bg-info' : 'bg-success'
                                }`} 
                                style={{ width: `${passwordStrength * 25}%` }}
                              ></div>
                            </div>
                            <small className="text-muted">
                              Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
                            </small>
                          </div>
                        )
                      }
                    ].map(({ label, name, type, help }) => (
                      <div className="col-12" key={name}>
                        <div className="form-floating mb-2">
                          <input
                            type={type}
                            className={`form-control border-0 border-bottom rounded-0 ${
                              errors[name] ? 'is-invalid' : ''
                            }`}
                            id={name}
                            name={name}
                            placeholder={label}
                            value={formData[name]}
                            onChange={handleChange}
                          />
                          <label htmlFor={name} className="form-label">{label}</label>
                          {errors[name] && (
                            <div className="invalid-feedback">{errors[name]}</div>
                          )}
                          {help && help}
                        </div>
                      </div>
                    ))}

                    <div className="col-12">
                      <div className="mb-2">
                        <label htmlFor="id_secteur" className="form-label text-light-dark fw-lighter">
                          Secteur :
                        </label>
                        <select
                          className={`form-control border-0 border-bottom shadow-none bg-transparent ${
                            errors.id_secteur ? 'is-invalid' : ''
                          }`}
                          id="id_secteur"
                          name="id_secteur"
                          value={formData.id_secteur}
                          onChange={handleChange}
                          disabled={secteurs.length === 0}
                        >
                          <option value="">Sélectionnez un secteur</option>
                          {secteurs.length > 0 ? (
                            secteurs.map((secteur) => (
                              <option key={secteur.id} value={secteur.id}>
                                {secteur.nom}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>Chargement des secteurs...</option>
                          )}
                        </select>
                        {errors.id_secteur && (
                          <div className="invalid-feedback">{errors.id_secteur}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                          type="checkbox"
                          id="terms"
                          required
                        />
                        <label className="form-check-label text-secondary" htmlFor="terms">
                          J'accepte les{' '}
                          <a href="#!" className="link-dark fw-bold text-decoration-none">
                            termes et conditions
                          </a>
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="d-grid">
                        <button
                          className="btn btn-lg btn-dark rounded-0 fs-6"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Enregistrement...
                            </>
                          ) : "S'inscrire"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="col-12 col-lg-2 d-flex align-items-center justify-content-center gap-3 flex-lg-column">
                <div className="bg-dark h-100 d-none d-lg-block" style={{ width: '1px', opacity: 0.1 }}></div>
                <div className="bg-dark w-100 d-lg-none" style={{ height: '1px', opacity: 0.1 }}></div>
                <div>ou</div>
                <div className="bg-dark h-100 d-none d-lg-block" style={{ width: '1px', opacity: 0.1 }}></div>
                <div className="bg-dark w-100 d-lg-none" style={{ height: '1px', opacity: 0.1 }}></div>
              </div>

              <div className="col-12 col-lg-5 d-flex align-items-center">
                <div className="d-flex gap-3 flex-column w-100">
                  <a href="#!" className="btn btn-outline-dark rounded-0 d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google text-danger" viewBox="0 0 16 16">
                      <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
                    </svg>
                    <span className="ms-2 fs-6 flex-grow-1">Continuer avec Google</span>
                  </a>
                  
                  <a href="#!" className="btn btn-outline-dark rounded-0 d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-apple text-dark" viewBox="0 0 16 16">
                      <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z"/>
                    </svg>
                    <span className="ms-2 fs-6 flex-grow-1">Continuer avec Apple</span>
                  </a>
                  
                  <a href="#!" className="btn btn-outline-dark rounded-0 d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook text-primary" viewBox="0 0 16 16">
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                    </svg>
                    <span className="ms-2 fs-6 flex-grow-1">Continuer avec Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;