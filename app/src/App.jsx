import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CarManagement from './pages/CarManagement';
import DriverManagement from './pages/DriverManagement';
import TripRegistration from './pages/TripRegistration';
import CarReservation from './pages/CarReservation';
import TripHistory from './pages/TripHistory';
import TripHistoryExit from './pages/TripRegistrationExit';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Para os ícones do Bootstrap
import CarReview from './pages/CarReview';

// Definir a URL da API
export const API_URL = 'http://localhost:8080/api'; // Local ou outro servidor de produção

function App() {
  const isAuthenticated = localStorage.getItem('userId'); // Verifica se o usuário está logado
  
  return (
    <Router>
      <Routes>
        {/* Rotas públicas - Login e Cadastro */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Cadastro />} />
        
        {/* Rotas privadas - Protegidas com a verificação de login */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard apiUrl={API_URL} /> : <Navigate to="/" />}
        />
        <Route
          path="/manage-car"
          element={isAuthenticated ? <CarManagement apiUrl={API_URL} /> : <Navigate to="/" />}
        />
        <Route
          path="/manage-drivers"
          element={isAuthenticated ? <DriverManagement apiUrl={API_URL} /> : <Navigate to="/" />}
        />
        <Route
          path="/register-trip"
          element={isAuthenticated ? <TripRegistration apiUrl={API_URL} /> : <Navigate to="/" />}
        />
        <Route
          path="/reserve-car"
          element={isAuthenticated ? <CarReservation apiUrl={API_URL} /> : <Navigate to="/" />}
        />
        <Route
          path="/trip-history"
          element={isAuthenticated ? <TripHistory apiUrl={API_URL} /> : <Navigate to="/" />}
        />
        <Route
          path="/register-trip-exit"
          element={isAuthenticated ? <TripHistoryExit apiUrl={API_URL} /> : <Navigate to="/" />}
        />
        <Route
          path="/cars-review"
          element={isAuthenticated ? <CarReview apiUrl={API_URL} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
