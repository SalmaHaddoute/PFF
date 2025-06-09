// import ConnectionTest from './ConnectionTest';
// import CorsTest from './CorsTest';

// function App() {
//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>React-Laravel Connection Test</h1>
//       <ConnectionTest />
//       <CorsTest/>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import LoginTest from './components/pages/LoginTest';
import StatusPage from './components/pages/StatusPage';
import Home from './components/pages/Home';
// Admin components
import App4 from './App4';
// Entreprise components
import App2 from './App2';



import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-test" element={<LoginTest />} />
          <Route path="/statue-page" element={<StatusPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<App4 />} />
          <Route path="/admin/*" element={<App4 />} />
          
          {/* Entreprise Routes */}
          <Route path="/entreprise" element={<App2 />} />
          <Route path="/entreprise/*" element={<App2 />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function NotFound() {
  return (
    <div className="text-center mt-5">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

export default App;