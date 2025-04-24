import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Compenants/Home/Home';
import Register from './Compenants/Home/register';
import Login from './Compenants/Home/Login';
import App from './App'; 
import App2 from './App2';
import './App.css';

function App3() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<App />} />
        <Route path="/entreprise/*" element={<App2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App3;