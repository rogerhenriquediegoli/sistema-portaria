import React, { useState, useEffect } from "react";
import "./CarReservation.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_URL } from "../App";

const CarReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
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

  useEffect(() => {
    // Buscar reservas e recursos disponíveis
    const fetchReservations = async () => {
      try {
        const resResponse = await fetch(`${API_URL}/reservas`);
        const reservationsData = await resResponse.json();
        setReservations(reservationsData);

        const availResponse = await fetch(`${API_URL}/reservas/disponiveis`);
        const availData = await availResponse.json();
        setAvailableCars(availData.carrosDisponiveis || []);
        setAvailableDrivers(availData.motoristasDisponiveis || []);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchReservations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReservation({ ...newReservation, [name]: value });
  };

  const handleAddReservation = () => {
    if (!newReservation.carro_placa || !newReservation.motorista_cpf || !newReservation.data_fim) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    fetch(`${API_URL}/reservas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        carro_placa: newReservation.carro_placa,
        motorista_cpf: newReservation.motorista_cpf,
        data_fim: newReservation.data_fim,
      }),
    })
      .then((res) => res.json())
      .then((createdReservation) => {
        setReservations([...reservations, createdReservation]);
        setNewReservation({ carro_placa: "", motorista_cpf: "", data_fim: "" });
      })
      .catch((error) => alert("Erro ao criar reserva: " + error));
  };

  const handleCancelReservation = (idReserva) => {
    fetch(`${API_URL}/reservas/${idReserva}`, { method: "DELETE" })
      .then(() => {
        setReservations((prev) =>
          prev.map((res) =>
            res.idReserva === idReserva ? { ...res, status: "Cancelada" } : res
          )
        );
      })
      .catch((error) => alert("Erro ao cancelar reserva: " + error));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredReservations = reservations.filter((res) => {
    const matchesCar = filters.carro_placa
      ? res.carro?.placa.includes(filters.carro_placa)
      : true;
    const matchesDriver = filters.motorista_cpf
      ? res.motorista?.cpf.includes(filters.motorista_cpf)
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
                  {availableCars.map((car) => (
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
                  {availableDrivers.map((driver) => (
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
                    <td>{res.carro?.placa}</td>
                    <td>{res.motorista?.cpf}</td>
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

export default CarReservation
