import React, { useState } from 'react';
import './TripRegistration.css';

const TripRegistration = () => {
  const [trip, setTrip] = useState({
    carro: '',
    motorista: '',
    quilometragemSaida: '',
    quilometragemRetorno: '',
    status: 'Em viagem',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrip({ ...trip, [name]: value });
  };

  return (
    <div className="trip-registration">
      <h2>Registrar Viagem</h2>
      <form>
        <input
          type="text"
          name="carro"
          placeholder="Carro"
          value={trip.carro}
          onChange={handleChange}
        />
        <input
          type="text"
          name="motorista"
          placeholder="Motorista"
          value={trip.motorista}
          onChange={handleChange}
        />
        <input
          type="number"
          name="quilometragemSaida"
          placeholder="Quilometragem de Saída"
          value={trip.quilometragemSaida}
          onChange={handleChange}
        />
        <input
          type="number"
          name="quilometragemRetorno"
          placeholder="Quilometragem de Retorno"
          value={trip.quilometragemRetorno}
          onChange={handleChange}
        />
        <button type="submit">Registrar Viagem</button>
      </form>
    </div>
  );
};

export default TripRegistration;
