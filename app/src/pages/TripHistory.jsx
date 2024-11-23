import React, { useState } from 'react';
import './TripHistory.css';

const TripHistory = () => {
  const [trips, setTrips] = useState([
    { carro: 'Fusca', motorista: 'João Silva', quilometragemSaida: 10000, quilometragemRetorno: 10100, status: 'Concluída' },
    { carro: 'Civic', motorista: 'Maria Oliveira', quilometragemSaida: 15000, quilometragemRetorno: 15200, status: 'Concluída' },
  ]);

  return (
    <div className="trip-history">
      <h2>Histórico de Viagens</h2>
      <table>
        <thead>
          <tr>
            <th>Carro</th>
            <th>Motorista</th>
            <th>Quilometragem de Saída</th>
            <th>Quilometragem de Retorno</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip, index) => (
            <tr key={index}>
              <td>{trip.carro}</td>
              <td>{trip.motorista}</td>
              <td>{trip.quilometragemSaida}</td>
              <td>{trip.quilometragemRetorno}</td>
              <td>{trip.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TripHistory;
