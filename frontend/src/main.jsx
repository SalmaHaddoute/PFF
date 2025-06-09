import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';
import App4 from './App4.jsx';
import { BrowserRouter } from 'react-router-dom';
// import App2 from './App2.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* quand tu utilise APP4 ET APP2 DECOMMENTER BROWSERrOUTER ET QUAND TU UTILISER App commenter BrowserRouter */}
    {/* <BrowserRouter> */}
    <App />
     {/* </BrowserRouter> */}
  </React.StrictMode>
);