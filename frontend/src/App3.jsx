import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Compenants/Home/Home';
import Register from './Compenants/Home/register';
import Login from './Compenants/Home/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import App from './App';
import App2 from './App2';
import VerifierEntreprise from './Compenants/VerifierEntreprise/VerifierEntreprise';
function App3() {
  return (
    <div>
       
       <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register style={{ background: '#f4f4f4' }} />} />
              <Route path="/login" element={<Login  style={{ background: '#f4f4f4' }} />} />
              <Route path="/admin/dashboard" element={<App/>} />
               <Route path="/enterprise/dashboard" element={<App2 />} /> 
</Routes>      
       
    </div>
  );
}

export default App3;