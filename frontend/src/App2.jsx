import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavbarAd from './components/admin/NavbarAd/NavbarAd';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from './components/pages/Footer/Footer';
import AjouterReclamation from './components/entreprise/Reclamation/AjouterReclamation/AjouterReclamation';
import ListReclamation from './components/entreprise/Reclamation/ListReclamation/ListReclamation';
import ReclamationRefuser from './components/entreprise/Reclamation/ReclamationRefuser/ReclamationRefuser';
import AjouterTechnicien from './components/entreprise/Technicien/AjouterTechicien/AjouterTechnicien';
import ListTechnicien from './components/entreprise/Technicien/ListTechnicien/ListTechnicien';
import ChercherTechnicien from './components/entreprise/Technicien/ChercherTechnicien/ChercherTechnicien';
import ChercherEn from './components/admin/ChercherEn/ChercherEn';
import Charts from './components/entreprise/ChartsEn/Charts';
import BlacklistDirectory from './components/admin/BlacklistDirectory/BlacklistDirectory';
import SiidBarEn from './components/entreprise/SiidBarEn/SiidBarEn';
import DashboardEn from './components/entreprise/DashboardEn/DashboardEn';
import MyBlacklist from './components/entreprise/MyBlacklist/MyBlacklist';
import EditReclamation from './components/entreprise/Reclamation/EditReclamation/EditReclamation';

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
              {/* Dashboard routes */}
              <Route path="/" element={<DashboardEn total_posts={10} accepted_posts={7} rejected_posts={3} total_techniciens={50} blacklist={[]} />} />
              <Route path="/dashboard" element={
                <DashboardEn
                  total_posts={10} 
                  accepted_posts={7} 
                  rejected_posts={3} 
                  total_techniciens={50} 
                  blacklist={[]} 
                />
              } />
              {/* Reclamations routes - relative paths */}
              <Route path="reclamations/ajouter" element={<AjouterReclamation />} />
              <Route path="reclamations/listsreclamation" element={<ListReclamation/>} />
              <Route path="reclamations/edit/:id" element={<EditReclamation />} />
              <Route path="reclamations/listsrefuser" element={<ReclamationRefuser />} />
              
              {/* Techniciens routes - relative paths */}
              <Route path="techniciens/ajouter" element={<AjouterTechnicien/>} />
              <Route path="techniciens/liststechnicien" element={<ListTechnicien/>} />
              <Route path="techniciens/cherchertechnicien" element={<ChercherTechnicien/>} />
              
              {/* Entreprise routes - relative paths */}
              <Route path="chercherentreprise" element={<ChercherEn/>} />
              <Route path="myblacklist" element={<MyBlacklist />} />
              <Route path="blacklist" element={<BlacklistDirectory />} />
              <Route path="statistiques" element={<Charts />} />
              
              

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