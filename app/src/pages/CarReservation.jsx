import React, { useState } from 'react';
import './CarReservation.css';

const CarReservation = () => {
  const [reservations, setReservations] = useState([
    { carro: 'Fusca', motorista: 'João Silva', dataFim: '2024-11-23 12:00', status: 'Ativa' },
    { carro: 'Civic', motorista: 'Maria Oliveira', dataFim: '2024-11-24 18:00', status: 'Concluída' },
  ]);

  const handleCancelReservation = (index) => {
    const updatedReservations = [...reservations];
    updatedReservations[index].status = 'Cancelada';
    setReservations(updatedReservations);
  };

  return (
    <div className="car-reservation">
      <h2>Reservar Carro</h2>
      <table>
        <thead>
          <tr>
            <th>Carro</th>
            <th>Motorista</th>
            <th>Data de Fim</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, index) => (
            <tr key={index}>
              <td>{reservation.carro}</td>
              <td>{reservation.motorista}</td>
              <td>{reservation.dataFim}</td>
              <td>{reservation.status}</td>
              <td>
                {reservation.status === 'Ativa' && (
                  <button onClick={() => handleCancelReservation(index)}>Cancelar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CarReservation;
