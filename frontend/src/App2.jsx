import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavbarAd from './Compenants/NavbarAd/NavbarAd';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from './Compenants/Footer/Footer';
import AjouterReclamation from './Compenants/Reclamation/AjouterReclamation/AjouterReclamation';
import ListReclamation from './Compenants/Reclamation/ListReclamation/ListReclamation';
import ReclamationRefuser from './Compenants/Reclamation/ReclamationRefuser/ReclamationRefuser';
import AjouterTechnicien from './Compenants/Technicien/AjouterTechicien/AjouterTechnicien';
import ListTechnicien from './Compenants/Technicien/ListTechnicien/ListTechnicien';
import ChercherTechnicien from './Compenants/Technicien/ChercherTechnicien/ChercherTechnicien';
import ChercherEn from './Compenants/ChercherEn/ChercherEn';
import Charts from './Compenants/ChartsEn/Charts';
import BlacklistDirectory from './Compenants/BlacklistDirectory/BlacklistDirectory';
import SiidBarEn from './Compenants/SiidBarEn/SiidBarEn';
import DashboardEn from './Compenants/DashboardEn/DashboardEn';
import MyBlacklist from './Compenants/MyBlacklist/MyBlacklist';

function App2() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    // Removed the <Router> wrapper
    <div className="app-container">
      <NavbarAd toggleSidebar={toggleSidebar} />
      
      <div className="main-content">
        {!sidebarCollapsed && <SiidBarEn />}
        
        <div className="content-area" style={{ marginLeft: sidebarCollapsed ? '0' : '250px' }}>
          <div className="page-content">
            <Routes>
              {/* Your routes remain the same */}
              <Route path="/dashboard" element={
                <DashboardEn
                  total_posts={10} 
                  accepted_posts={7} 
                  rejected_posts={3} 
                  total_techniciens={50} 
                  blacklist={[]} 
                />
              } />
              <Route path="/reclamations/ajouter" element={<AjouterReclamation />} />
              <Route path="/reclamations/listsreclamation" element={<ListReclamation/>} />
              <Route path="/reclamations/listsrefuser" element={<ReclamationRefuser />} />
              <Route path="/techniciens/ajouter" element={ <AjouterTechnicien/>} />
              <Route path="/techniciens/liststechnicien" element={<ListTechnicien/>} />
              <Route path="/techniciens/cherchertechnicien" element={<ChercherTechnicien/>} />
              <Route path="/entreprise/chercherentreprise" element={ <ChercherEn/>} />
              <Route path="/entreprise/myblacklist" element={<MyBlacklist />} />
              <Route path="/blacklist" element={<BlacklistDirectory />} />
              <Route path="/entreprise/statistiques" element={<Charts />} />
              
              

              {/* ... other routes */}
            </Routes>
          </div>
          
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App2;