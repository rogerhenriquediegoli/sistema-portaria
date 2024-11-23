import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./TripRegistration.css";

const TripRegistrationExit= () => {
  const [cars, setCars] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedCar, setSelectedCar] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [tripData, setTripData] = useState({
    kilometragem: 0,
    nivelCombustivel: 0,
    horarioSaida: "",
  });

  useEffect(() => {
    // Simulação de fetch dos carros disponíveis e motoristas disponíveis
    setCars([
      { placa: "ABC1234", status: "Disponível" },
      { placa: "DEF5678", status: "Reservado", reservadoPara: "12345678900" },
    ]);
    setDrivers([
      { cpf: "12345678900", nome: "João Silva", status: "Disponível" },
      { cpf: "98765432100", nome: "Maria Oliveira", status: "Disponível" },
    ]);
  }, []);

  const handleCarChange = (e) => setSelectedCar(e.target.value);
  const handleDriverChange = (e) => setSelectedDriver(e.target.value);
  const handleInputChange = (e) =>
    setTripData({ ...tripData, [e.target.name]: e.target.value });

  return (
    <div className="register-trip-exit">
      <Header />
      <main className="container my-5">
        <div className="card shadow">
          <div className="card-header bg-success text-white">
            <h4>
              <i className="bi bi-box-arrow-up-right"></i> Registrar Saída
            </h4>
          </div>
          <div className="card-body">
            <form>
              <div className="mb-3">
                <label htmlFor="car" className="form-label">
                  Carro
                </label>
                <select
                  id="car"
                  className="form-select"
                  value={selectedCar}
                  onChange={handleCarChange}
                >
                  <option value="">Selecione um carro</option>
                  {cars.map((car) =>
                    car.status === "Disponível" || car.reservadoPara === selectedDriver ? (
                      <option key={car.placa} value={car.placa}>
                        {car.placa} {car.status === "Reservado" ? "(Reservado)" : ""}
                      </option>
                    ) : null
                  )}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="driver" className="form-label">
                  Motorista
                </label>
                <select
                  id="driver"
                  className="form-select"
                  value={selectedDriver}
                  onChange={handleDriverChange}
                >
                  <option value="">Selecione um motorista</option>
                  {drivers.map((driver) => (
                    <option key={driver.cpf} value={driver.cpf}>
                      {driver.nome} ({driver.cpf})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="kilometragem" className="form-label">
                  Quilometragem Atual (km)
                </label>
                <input
                  type="number"
                  id="kilometragem"
                  name="kilometragem"
                  className="form-control"
                  value={tripData.kilometragem}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="fuelLevel" className="form-label">
                  Nível de Combustível Atual (%)
                </label>
                <input
                  type="number"
                  id="fuelLevel"
                  name="nivelCombustivel"
                  className="form-control"
                  value={tripData.nivelCombustivel}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="time" className="form-label">
                  Horário de Saída
                </label>
                <input
                  type="datetime-local"
                  id="time"
                  name="horarioSaida"
                  className="form-control"
                  value={tripData.horarioSaida}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="btn btn-success w-100">
                Registrar Saída
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TripRegistrationExit;
