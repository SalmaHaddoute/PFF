import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import NavbarAd from './Compenants/NavbarAd/NavbarAd';
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
    <div className="app-container">
      <NavbarAd toggleSidebar={toggleSidebar} />
      
      <div className="main-content">
        {!sidebarCollapsed && <SiidBarEn />}
        
        <div className="content-area" style={{ marginLeft: sidebarCollapsed ? '0' : '250px' }}>
          <div className="page-content">
            <Routes>
              <Route path="dashboard" element={
                <DashboardEn
                total_posts={10} 
                accepted_posts={7} 
                rejected_posts={3} 
                total_techniciens={50} 
                blacklist={[]} 
                />
              } />
              <Route path="reclamations/ajouter" element={<AjouterReclamation />} />
              <Route path="reclamations/liste" element={<ListReclamation />} />
              <Route path="reclamations/refusees" element={<ReclamationRefuser />} />
              <Route path="techniciens/ajouter" element={<AjouterTechnicien />} />
              <Route path="techniciens/liste" element={<ListTechnicien />} />
              <Route path="techniciens/chercher" element={<ChercherTechnicien />} />
              <Route path="entreprises/chercher" element={<ChercherEn />} />
              <Route path="blacklist/mon-liste" element={<MyBlacklist />} />
              <Route path="blacklist/directory" element={<BlacklistDirectory />} />
              <Route path="statistiques" element={<Charts />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App2;