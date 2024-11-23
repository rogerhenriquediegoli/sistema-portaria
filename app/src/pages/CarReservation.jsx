import React, { useState } from "react";
import "./CarReservation.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CarReservation = () => {
  const [reservations, setReservations] = useState([
    {
      idReserva: 1,
      carro_placa: "ABC1234",
      motorista_cpf: "12345678900",
      data_fim: "2024-12-01",
      status: "Ativa",
    },
  ]);

  const [cars, setCars] = useState([
    { placa: "ABC1234", modelo: "Fusca", status: "Disponível" },
    { placa: "XYZ5678", modelo: "Civic", status: "Em uso" },
  ]);

  const [drivers, setDrivers] = useState([
    { cpf: "12345678900", nome: "João Silva", status: "Disponível" },
    { cpf: "09876543211", nome: "Maria Santos", status: "Em viagem" },
  ]);

  const [newReservation, setNewReservation] = useState({
    carro_placa: "",
    motorista_cpf: "",
    data_fim: "",
  });

  const [filters, setFilters] = useState({
    carro_placa: "",
    motorista_cpf: "",
    status: "",
    data_fim: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "data_fim") {
      const today = new Date();
      const selectedDate = new Date(value);

      if (selectedDate <= today) {
        alert("A data de fim deve ser pelo menos um dia à frente da data atual.");
        return;
      }
    }

    setNewReservation({ ...newReservation, [name]: value });
  };

  const handleAddReservation = () => {
    if (
      !newReservation.carro_placa ||
      !newReservation.motorista_cpf ||
      !newReservation.data_fim
    ) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    const today = new Date();
    const selectedDate = new Date(newReservation.data_fim);

    if (selectedDate <= today) {
      alert("A data de fim deve ser pelo menos um dia à frente da data atual.");
      return;
    }

    const newReservationData = {
      ...newReservation,
      idReserva: reservations.length + 1,
      status: "Ativa",
    };

    setReservations([...reservations, newReservationData]);
    setNewReservation({ carro_placa: "", motorista_cpf: "", data_fim: "" });
  };

  const handleCancelReservation = (idReserva) => {
    const updatedReservations = reservations.map((res) =>
      res.idReserva === idReserva ? { ...res, status: "Cancelada" } : res
    );
    setReservations(updatedReservations);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredReservations = reservations.filter((res) => {
    const matchesCar = filters.carro_placa
      ? res.carro_placa.includes(filters.carro_placa)
      : true;
    const matchesDriver = filters.motorista_cpf
      ? res.motorista_cpf.includes(filters.motorista_cpf)
      : true;
    const matchesStatus = filters.status
      ? res.status === filters.status
      : true;
    const matchesDate = filters.data_fim
      ? res.data_fim === filters.data_fim
      : true;

    return matchesCar && matchesDriver && matchesStatus && matchesDate;
  });

  return (
    <div className="reserve-car">
      <Header />
      <main className="container my-5">
        <div className="card shadow">
          <div className="card-header bg-info text-white">
            <h4>
              <i className="bi bi-calendar"></i> Reservar Carro
            </h4>
          </div>
          <div className="card-body">
            <form className="row g-3 mb-4">
              <div className="col-md-3">
                <label htmlFor="carro_placa" className="form-label">Carro</label>
                <select
                  className="form-select"
                  id="carro_placa"
                  name="carro_placa"
                  value={newReservation.carro_placa}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione um carro</option>
                  {cars
                    .filter((car) => car.status === "Disponível")
                    .map((car) => (
                      <option key={car.placa} value={car.placa}>
                        {car.modelo} - {car.placa}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-md-3">
                <label htmlFor="motorista_cpf" className="form-label">Motorista</label>
                <select
                  className="form-select"
                  id="motorista_cpf"
                  name="motorista_cpf"
                  value={newReservation.motorista_cpf}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione um motorista</option>
                  {drivers
                    .filter((driver) => driver.status === "Disponível")
                    .map((driver) => (
                      <option key={driver.cpf} value={driver.cpf}>
                        {driver.nome} - {driver.cpf}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-md-3">
                <label htmlFor="data_fim" className="form-label">Data de Fim</label>
                <input
                  type="date"
                  className="form-control"
                  id="data_fim"
                  name="data_fim"
                  value={newReservation.data_fim}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3 text-end">
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={handleAddReservation}
                >
                  <i className="bi bi-plus-circle"></i> Adicionar Reserva
                </button>
              </div>
            </form>

            <form className="row g-3 mb-4">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  name="carro_placa"
                  placeholder="Filtrar por carro"
                  value={filters.carro_placa}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  name="motorista_cpf"
                  placeholder="Filtrar por motorista"
                  value={filters.motorista_cpf}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">Filtrar por status</option>
                  <option value="Ativa">Ativa</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  name="data_fim"
                  value={filters.data_fim}
                  onChange={handleFilterChange}
                />
              </div>
            </form>

            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Carro</th>
                  <th>Motorista</th>
                  <th>Data de Fim</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((res) => (
                  <tr key={res.idReserva}>
                    <td>{res.idReserva}</td>
                    <td>{res.carro_placa}</td>
                    <td>{res.motorista_cpf}</td>
                    <td>{res.data_fim}</td>
                    <td>
                      <span
                        className={`badge ${
                          res.status === "Ativa"
                            ? "bg-success"
                            : res.status === "Cancelada"
                            ? "bg-danger"
                            : "bg-secondary"
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td>
                      {res.status === "Ativa" && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleCancelReservation(res.idReserva)}
                        >
                          <i className="bi bi-x-circle"></i> Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CarReservation;
