import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'  // Importando o BrowserRouter
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={window.location.pathname || ''}>  {/* Definindo o basename */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)
