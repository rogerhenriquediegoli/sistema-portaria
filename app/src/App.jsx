import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import CarManagement from './pages/CarManagement/CarManagement.jsx';
import DriverManagement from './pages/DriverManagement/DriverManagement.jsx';
import TripRegistration from './pages/TripRegistration/TripRegistration.jsx';
import CarReservation from './pages/CarReservation/CarReservation.jsx';
import TripHistory from './pages/TripHistory/TripHistory.jsx';
import TripRegistrationExit from './pages/TripRegistrationExit/TripRegistrationExit.jsx';
import TripRegistrationEntry from './pages/TripRegistrationEntry/TripRegistrationEntry.jsx';
import Login from './pages/Login/Login.jsx';
import Cadastro from './pages/Cadastro/Cadastro.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Para os ícones do Bootstrap
import CarReview from './pages/CarReview/CarReview.jsx';

// Definir a URL da API
export const API_URL = 'https://sistema-portaria-api.onrender.com/api'; // Local ou outro servidor de produção

function App() {
  const isAuthenticated = localStorage.getItem('userId'); // Verifica se o usuário está logado
  
  return (
      <Routes>
        {/* Rotas públicas - Login e Cadastro */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login/>} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Cadastro/>} />
        
        {/* Rotas privadas - Protegidas com a verificação de login */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard/> : <Navigate to="/" />}
        />
        <Route
          path="/manage-car"
          element={isAuthenticated ? <CarManagement/> : <Navigate to="/" />}
        />
        <Route
          path="/manage-drivers"
          element={isAuthenticated ? <DriverManagement/> : <Navigate to="/" />}
        />
        <Route
          path="/register-trip"
          element={isAuthenticated ? <TripRegistration/> : <Navigate to="/" />}
        />
        <Route
          path="/reserve-car"
          element={isAuthenticated ? <CarReservation/> : <Navigate to="/" />}
        />
        <Route
          path="/trip-history"
          element={isAuthenticated ? <TripHistory/> : <Navigate to="/" />}
        />
        <Route
          path="/register-trip-exit"
          element={isAuthenticated ? <TripRegistrationExit/> : <Navigate to="/" />}
        />

        <Route
          path="/register-trip-entry"
          element={isAuthenticated ? <TripRegistrationEntry/> : <Navigate to="/" />}
        />
        <Route
          path="/cars-review"
          element={isAuthenticated ? <CarReview/> : <Navigate to="/" />}
        />
      </Routes>
  );
}

export default App;
