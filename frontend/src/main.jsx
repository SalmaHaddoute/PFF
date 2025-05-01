import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import App2 from './App2.jsx'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    
   <App/>
  </BrowserRouter>
  </StrictMode>,
)
