import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const Home = () => {

const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  return (
    <div  >
      {/* Navbar avec effet scroll */}
      <div className={`site-navbar-wrap`}>
        <div >
          <div className="site-navbar">
            <div className="navbar-top">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h1 className="site-logo"><Link to="/Home">BLACKLIST</Link></h1>
                </div>
                <div className="col-md-6">
                  <div className="contact-info">
                    <a href="mailto:info@blacklist.com" className="email-link">
                      <span className="icon-envelope mr-2"></span>
                      <span>info@blacklist.com</span>
                    </a>
                    <a href="tel:+12345678910" className="phone-link">
                      <span className="icon-phone mr-2"></span>
                      <span>+1 234 567 8910</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="nav-separator"></div>

            <div className="navbar-bottom">
              <nav className="main-navigation">
                <ul className="site-menu">
                  <li><Link to="/Home" className="nav-link">Accueil</Link></li>
                  <li><Link to="/services" className="nav-link">Services</Link></li>
                  <li><Link to="/contact" className="nav-link">Contact</Link></li>
                  <li><Link to="/login" className="nav-link">Connexion</Link></li>
                  <li><Link to="/register" className="nav-link nav-cta">Inscription</Link></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Plateforme de Signalement des Entreprises Frauduleuses</h1>
          <p>Signalez une entreprise frauduleuse et aidez à protéger les autres</p>
          <Link to="/services" className="btn btn-warning">Voir les détails</Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="services-title">SERVICES</h2>
          <p className="services-subtitle">Des solutions intelligentes pour une détection et une analyse avancées.</p>

          <div className="services-container">
            <div className="service-card">
              <i className="fas fa-shield-alt service-icon"></i>
              <h5 className="service-title">Fraud Detection</h5>
              <p className="card-text">Real-time analysis of suspicious behaviors and fraudulent transactions.</p>
            </div>

            <div className="service-card">
              <i className="fas fa-chart-line service-icon"></i>
              <h5 className="service-title">Advanced Analytics</h5>
              <p className="card-text">Tracking and visualization of suspicious activities through interactive dashboards.</p>
            </div>

            <div className="service-card">
              <i className="fas fa-code service-icon"></i>
              <h5 className="service-title">Verification API</h5>
              <p className="card-text">A flexible API to integrate our tools with your existing systems.</p>
            </div>

            <div className="service-card">
              <i className="fas fa-user-shield service-icon"></i>
              <h5 className="service-title">User Protection</h5>
              <p className="card-text">Ensuring user safety with advanced security measures.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat">
            <div className="number">5000</div>
            <div className="label">Avis Publiés</div>
          </div>
          <div className="stat">
            <div className="number">200</div>
            <div className="label">Entreprises sur Liste Noire</div>
          </div>
          <div className="stat">
            <div className="number">10000</div>
            <div className="label">Clients Satisfaits</div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-5 contact-section" id="contact">
        <div className="container">
          <h2 className="section-title">Contactez-nous</h2>
          <p className="section-subtitle">Nous sommes disponibles pour répondre à toutes vos questions.</p>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="contact-card">
                <h4 className="contact-title">Nos Coordonnées</h4>
                <div className="contact-info">
                  <p><i className="bi bi-geo-alt"></i> 123 Rue de la Sécurité, Paris, France</p>
                  <p><i className="bi bi-envelope"></i> <a href="mailto:contact@blacklist.com">contact@blacklist.com</a></p>
                  <p><i className="bi bi-telephone"></i> +33 1 23 45 67 89</p>
                </div>
                <div className="map-container">
                  <iframe
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=fr&amp;q=maroc,khemisset+(blacklist)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                    title="Localisation Blacklist">
                  </iframe>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="contact-card">
                <h4 className="contact-title">Envoyez-nous un Message</h4>
                <form>
                  <div className="form-group">
                    <label htmlFor="name"><i className="bi bi-person"></i> Nom</label>
                    <input type="text" className="form-control" id="name" name="name" placeholder="Votre nom" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email"><i className="bi bi-envelope"></i> Email</label>
                    <input type="email" className="form-control" id="email" name="email" placeholder="Votre email" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message"><i className="bi bi-chat-dots"></i> Message</label>
                    <textarea className="form-control" id="message" name="message" rows="5" placeholder="Votre message" required></textarea>
                  </div>
                  <button type="submit" className="btn btn-warning">
                    <i className="bi bi-send"></i> Envoyer
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="section-header">
            <h3 className="section-title">Des Avis</h3>
            <p className="section-subtitle">
              Découvrez ce que nos clients disent de notre plateforme. Leurs retours nous aident à nous améliorer continuellement.
            </p>
          </div>

          <div className="row text-center">
            <div className="col-md-4 mb-5 mb-md-0">
              <div className="testimonial-card">
                <div className="d-flex justify-content-center mb-4">
                  <img src="src/assets/images/IMG1.jpg" className="rounded-circle shadow-1-strong" width="150" height="150" alt="Maria Smantha" />
                </div>
                <h5 className="mb-3">Maria Smantha</h5>
                <h6 className="text-secondary mb-3">Développeuse Web</h6>
                <p className="px-xl-3">
                  <i className="fas fa-quote-left pe-2"></i>
                  La plateforme Blacklist est un outil indispensable pour sécuriser nos transactions. Les analyses en temps réel sont très précises.
                </p>
                <ul className="list-unstyled d-flex justify-content-center mb-0">
                  {[1, 2, 3, 4].map((star) => (
                    <li key={star}><i className="fas fa-star fa-sm text-warning"></i></li>
                  ))}
                  <li><i className="fas fa-star-half-alt fa-sm text-warning"></i></li>
                </ul>
              </div>
            </div>

            <div className="col-md-4 mb-5 mb-md-0">
              <div className="testimonial-card">
                <div className="d-flex justify-content-center mb-4">
                  <img src="src/assets/images/IMG3.jpg" className="rounded-circle shadow-1-strong" width="150" height="150" alt="Lisa Cudrow" />
                </div>
                <h5 className="mb-3">Lisa Cudrow</h5>
                <h6 className="text-secondary mb-3">Designer Graphique</h6>
                <p className="px-xl-3">
                  <i className="fas fa-quote-left pe-2"></i>
                  Grâce à Blacklist, nous avons pu identifier et bloquer plusieurs tentatives de fraude. L'interface est intuitive et facile à utiliser.
                </p>
                <ul className="list-unstyled d-flex justify-content-center mb-0">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <li key={star}><i className="fas fa-star fa-sm text-warning"></i></li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-md-4 mb-0">
              <div className="testimonial-card">
                <div className="d-flex justify-content-center mb-4">
                  <img src="src/assets/images/IMG4.jpg" className="rounded-circle shadow-1-strong" width="150" height="150" alt="John Smith" />
                </div>
                <h5 className="mb-3">John Smith</h5>
                <h6 className="text-secondary mb-3">Spécialiste en Marketing</h6>
                <p className="px-xl-3">
                  <i className="fas fa-quote-left pe-2"></i>
                  Une solution robuste et fiable pour protéger notre entreprise. Les rapports détaillés nous aident à prendre des décisions éclairées.
                </p>
                <ul className="list-unstyled d-flex justify-content-center mb-0">
                  {[1, 2, 3, 4].map((star) => (
                    <li key={star}><i className="fas fa-star fa-sm text-warning"></i></li>
                  ))}
                  <li><i className="far fa-star fa-sm text-warning"></i></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-04 bg-dark">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-3 mb-md-0 mb-4">
              <h2 className="footer-heading"><Link to="/" className="logo">Blacklist</Link></h2>
              <p>Une plateforme dédiée à la protection des consommateurs contre les entreprises frauduleuses.</p>
              <Link to="/about">Lire la suite</Link>
            </div>
            <div className="col-md-6 col-lg-3 mb-md-0 mb-4">
              <h2 className="footer-heading">Catégories</h2>
              <ul className="list-unstyled">
                <li><Link to="/services" className="py-1 d-block">Achat &amp; Vente</Link></li>
                <li><Link to="/services" className="py-1 d-block">Commerçants</Link></li>
                <li><Link to="/about" className="py-1 d-block">Engagement social</Link></li>
                <li><Link to="/contact" className="py-1 d-block">Aide &amp; Support</Link></li>
              </ul>
            </div>
            <div className="col-md-6 col-lg-3 mb-md-0 mb-4">
              <h2 className="footer-heading">Pages</h2>
              <div className="tagcloud">
                <Link to="/team" className="tag-cloud-link bg-dark">Équipe</Link>
                <Link to="/pricing" className="tag-cloud-link bg-dark">Tarification</Link>
                <Link to="/faq" className="tag-cloud-link bg-dark">FAQ</Link>
                <Link to="/contact" className="tag-cloud-link bg-dark">Contact</Link>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 mb-md-0 mb-4">
              <h2 className="footer-heading">S'abonner</h2>
              <form className="subscribe-form">
                <div className="form-group d-flex">
                  <input type="text" className="form-control rounded-left " placeholder="Entrez votre adresse e-mail" />
                  <button type="submit" className="form-control submit rounded-right mx-3 ">
                    <span className="sr-only text-warning">Envoyer</span>
                    <i className="ion-ios-send"></i>
                  </button>
                </div>
              </form>
              <h2 className="footer-heading mt-5">Suivez-nous</h2>
              <ul className="ftco-footer-social p-0">
                <li className="ftco-animate"><a href="#" data-toggle="tooltip" data-placement="top" title="Facebook"><span className="icon-facebook"></span></a></li>
                <li className="ftco-animate"><a href="#" data-toggle="tooltip" data-placement="top" title="LinkedIn"><span className="icon-linkedin"></span></a></li>
                <li className="ftco-animate"><a href="#" data-toggle="tooltip" data-placement="top" title="Instagram"><span className="icon-instagram"></span></a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-100 mt-5 border-top py-5">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-lg-8">
                <p className="copyright">
                  Copyright &copy;{new Date().getFullYear()} Tous droits réservés | Ce modèle a été conçu avec <i className="ion-ios-heart" aria-hidden="true"></i> par <Link to="/">Blacklist.com</Link>
                </p>
              </div>
              <div className="col-md-6 col-lg-4 text-md-right">
                <p className="mb-0 list-unstyled">
                  <Link className="mr-md-3" to="/terms">Conditions</Link>
                  <Link className="mr-md-3" to="/privacy">Confidentialité</Link>
                  <Link className="mr-md-3" to="/compliance">Conformité</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;