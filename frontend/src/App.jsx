import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavbarAd from './Compenants/NavbarAd/NavbarAd';
import Sidebar from './Compenants/SiidBarAd/SiidBarAd';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from './Compenants/Footer/Footer';
import DashboardAd from './Compenants/DashboardAd/DashboardAd';
import VerifierEntreprise from './Compenants/VerifierEntreprise/VerifierEntreprise';
import ChercherEn from './Compenants/ChercherEn/ChercherEn';
import AjouterSecteur from './Compenants/AjouterSecteur/AjouterSecteur';
import VerifierReclamation from './Compenants/VerifierReclamation/VerifierReclamation';
import Charts from './Compenants/ChartsAd/Charts';
import BlacklistDirectory from './Compenants/BlacklistDirectory/BlacklistDirectory';
import AjouterReclamation from './Compenants/Reclamation/AjouterReclamation/AjouterReclamation';
import AjouterObservation from './Compenants/VerifierReclamation/AjouterObservation';

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
              {/* Your routes remain the same */}
              <Route path="/dashboard" element={
                <DashboardAd 
                  total_posts={10} 
                  accepted_posts={7} 
                  rejected_posts={3} 
                  total_products={50} 
                  blacklist={[]} 
                />
              } />
              <Route path="/entreprises/verifier" element={<VerifierEntreprise />} />
              <Route path="/entreprises/chercher" element={<ChercherEn />} />
              <Route path="/entreprises/secteurs" element={<AjouterSecteur />} />
              <Route path="/admin/verifier-reclamations" element={<VerifierReclamation />} />
              <Route path="/admin/ajouter-observation" element={<AjouterObservation />} />
              <Route path="/admin/statistiques" element={<Charts />} />
              <Route path="/blacklist" element={<BlacklistDirectory />} />
              

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