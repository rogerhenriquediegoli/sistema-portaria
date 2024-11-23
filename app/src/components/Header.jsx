// src/components/Header.js
import React from 'react';
import './Header.css'; // Se necessário, crie um CSS específico para o Header

const Header = () => {
  return (
    <header className="bg-dark text-white">
        <h1><i className="bi bi-calendar3"></i> Gestão de Veículos e Motoristas</h1>
        <p>Sistema de portaria para controle de veículos e motoristas</p>
    </header>
  );
};

export default Header;
