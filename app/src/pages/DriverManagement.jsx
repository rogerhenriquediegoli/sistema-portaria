import React, { useState } from 'react';
import './DriverManagement.css';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([
    { cpf: '12345678901', nome: 'João Silva', status: 'Disponível' },
    { cpf: '98765432100', nome: 'Maria Oliveira', status: 'Em viagem' },
  ]);

  return (
    <div className="driver-management">
      <h2>Gerenciamento de Motoristas</h2>
      <table>
        <thead>
          <tr>
            <th>CPF</th>
            <th>Nome</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver, index) => (
            <tr key={index}>
              <td>{driver.cpf}</td>
              <td>{driver.nome}</td>
              <td>{driver.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverManagement;
