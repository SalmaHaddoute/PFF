import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import NavbarAd from './components/admin/NavbarAd/NavbarAd';
import Sidebar from './components/admin/SiidBarAd/SiidBarAd';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from './components/pages/Footer/Footer';
import DashboardAd from './components/admin/DashboardAd/DashboardAd';
import VerifierEntreprise from './components/admin/VerifierEntreprise/VerifierEntreprise';
import ChercherEn from './components/admin/ChercherEn/ChercherEn';
import AjouterSecteur from './components/admin/AjouterSecteur/AjouterSecteur';
import VerifierReclamation from './components/admin/VerifierReclamation/VerifierReclamation';
import Charts from './components/admin/ChartsAd/Charts';
import BlacklistDirectory from './components/admin/BlacklistDirectory/BlacklistDirectory';
import AjouterObservation from './components/admin/VerifierReclamation/AjouterObservation';
import ReclamationRefuser from './components/admin/VerifierReclamation/ReclamationRefuser';
import EditReclamation from './components/admin/VerifierReclamation/EditerReclamation';



function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    // Removed the <Router> wrapper
    <div className="app-container">
      <NavbarAd toggleSidebar={toggleSidebar} />
      
      <div className="main-content">
        {!sidebarCollapsed && <Sidebar />}
        
        <div className="content-area" style={{ marginLeft: sidebarCollapsed ? '0' : '250px' }}>
          <div className="page-content">
            <Routes>
              {/* Dashboard route */}
              <Route path="/" element={<DashboardAd />} />
              
              {/* Entreprise routes - relative paths within /admin/ */}
              <Route path="entreprises/verifier" element={<VerifierEntreprise />} />
              <Route path="entreprises/chercher" element={<ChercherEn />} />
              <Route path="entreprises/secteurs" element={<AjouterSecteur />} />
              
              {/* Reclamation routes - relative paths */}
              <Route path="verifier-reclamations" element={<VerifierReclamation />} />
              <Route path="ajouter-observation" element={<AjouterObservation />} />
              <Route path="reclamations-refuser" element={<ReclamationRefuser />} />
              <Route path='edit-reclamation' element={<EditReclamation/>}/>
              
              {/* Other admin routes */}
              <Route path="statistiques" element={<Charts />} />
              <Route path="blacklists" element={<BlacklistDirectory />} />
              

              {/* ... other routes */}
            </Routes>
          </div>
          
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;