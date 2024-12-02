import React from 'react';
import './Header.css'; // Se necessário, crie um CSS específico para o Header

const Header = () => {
  return (
    <header className="bg-dark text-white d-flex justify-content-between align-items-center p-3">
      <div>
        <h1>
          <i className="bi bi-calendar3"></i> Gestão de Veículos e Motoristas
        </h1>
        <p>Sistema de portaria para controle de veículos e motoristas</p>
      </div>
      <div>
        <a href="/dashboard" className="btn btn-primary">
          <i className="bi bi-house"></i> Dashboard
        </a>
      </div>
    </header>
  );
};

export default Header;
