import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CarManagement from './pages/CarManagement';
import DriverManagement from './pages/DriverManagement';
import TripRegistration from './pages/TripRegistration';
import CarReservation from './pages/CarReservation';
import TripHistory from './pages/TripHistory';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Para os ícones do Bootstrap


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manage-car" element={<CarManagement />} />
        <Route path="/manage-drivers" element={<DriverManagement />} />
        <Route path="/register-trip" element={<TripRegistration />} />
        <Route path="/reserve-car" element={<CarReservation />} />
        <Route path="/trip-history" element={<TripHistory />} />
      </Routes>
    </Router>
  );
}

export default App;