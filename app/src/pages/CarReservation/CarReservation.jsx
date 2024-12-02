import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "./CarReservation.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { API_URL } from '../../App';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CarReservation.css";

const CarReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [newReservation, setNewReservation] = useState({
    carroId: "",
    motoristaId: "",
    dataFim: "",
  });
  const [filters, setFilters] = useState({
    carro_placa: "",
    motorista_cpf: "",
    status: "",
    data_fim: "",
  });
  const [carDetails, setCarDetails] = useState({});
  const [driverDetails, setDriverDetails] = useState({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchReservationsAndAvailability = async () => {
    setLoading(true);
    try {
      const resResponse = await fetch(`${API_URL}/reservas`);
      if (!resResponse.ok) {
        const errorText = await resResponse.text();
        toast.error(`Erro ao buscar reservas: ${errorText}`);
        return; // Retorna se houver erro
      }
      const reservationsData = await resResponse.json();
      setReservations(reservationsData);

      const availResponse = await fetch(`${API_URL}/reservas/disponiveis`);
      if (!availResponse.ok) {
        const errorText = await availResponse.text();
        toast.error(`Erro ao buscar disponibilidade: ${errorText}`);
        return; // Retorna se houver erro
      }
      const availData = await availResponse.json();
      setAvailableCars(availData.carrosDisponiveis || []);
      setAvailableDrivers(availData.motoristasDisponiveis || []);

      const cars = {};
      const drivers = {};
      for (let res of reservationsData) {
        if (res.carroId && !cars[res.carroId]) {
          const carResponse = await fetch(`${API_URL}/carros/${res.carroId}`);
          const carData = await carResponse.json();
          cars[res.carroId] = carData;
        }
        if (res.motoristaId && !drivers[res.motoristaId]) {
          const driverResponse = await fetch(`${API_URL}/motoristas/${res.motoristaId}`);
          const driverData = await driverResponse.json();
          drivers[res.motoristaId] = driverData;
        }
      }
      setCarDetails(cars);
      setDriverDetails(drivers);
    } catch (error) {
      toast.error("Erro ao buscar dados do servidor.");
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      carro_placa: "",
      motorista_cpf: "",
      status: "",
      data_fim: "",
    });
  };
  

  useEffect(() => {
    fetchReservationsAndAvailability();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReservation({ ...newReservation, [name]: value });
  };

  const formatDate = (date) => {
    if (!date || isNaN(new Date(date).getTime())) {
      console.error("Data inválida passada para formatDate:", date);
      return ""; // Retorna string vazia ou trate conforme a lógica do seu app
    }
    return new Date(date).toISOString().split("T")[0];
  };

  const handleAddReservation = async () => {
    const { carroId, motoristaId, dataFim } = newReservation;
  
    // Verificar se os campos estão preenchidos
    if (!carroId || !motoristaId || !dataFim) {
      toast.warn("Todos os campos são obrigatórios.");
      return;
    }
  
    const formattedDate = formatDate(dataFim); // Formatar a data corretamente
    const url = `${API_URL}/reservas?motoristaId=${motoristaId}&carroId=${carroId}&dataFim=${formattedDate}`;
  
    try {
      const res = await fetch(url, { method: "POST" });
  
      if (!res.ok) {
        const errorText = await res.text();
        toast.error(`${errorText}`);
        return; // Retorna se houver erro
      }
  
      const responseText = await res.text();
      let createdReservation = { message: responseText };  // Caso a resposta seja uma string
  
      try {
        createdReservation = JSON.parse(responseText);
      } catch (error) {
        console.log('Erro ao parsear JSON:', error);
      }
  
      if (createdReservation?.message) {
        toast.success(createdReservation.message);
      } else {
        // Adicionar a nova reserva à lista
        setReservations((prev) => [...prev, createdReservation]);
        setNewReservation({ carroId: "", motoristaId: "", dataFim: "" }); // Limpar o formulário
        toast.success("Reserva criada com sucesso!");
      }
  
      // Atualizar carros e motoristas disponíveis
      await fetchReservationsAndAvailability();
  
    } catch (error) {
      toast.error("Erro ao criar a reserva. Verifique sua conexão ou tente novamente.");
      console.error("Erro ao criar a reserva:", error);
    }
  };  
  

  const handleCancelReservation = async () => {
    if (!reservationToCancel) return;

    try {
      const res = await fetch(`${API_URL}/reservas/${reservationToCancel.idReserva}/cancelar`, {
        method: "PUT",
      });

      if (!res.ok) {
        const errorText = await res.text();
        toast.error(`Erro ao cancelar: ${errorText}`);
        console.error("Erro ao cancelar reserva:", errorText);
        return;
      }

      setReservations((prev) =>
        prev.map((res) =>
          res.idReserva === reservationToCancel ? { ...res, status: "Cancelada" } : res
        )
      );

      toast.success("Reserva cancelada com sucesso!");

      // Atualiza carros e motoristas disponíveis
      fetchReservationsAndAvailability();
    } catch (error) {
      toast.error("Erro ao cancelar a reserva.");
      console.error("Erro ao cancelar reserva:", error);
    } finally {
      setShowCancelModal(false);
      setReservationToCancel(null);
    }
  };

  const handleCancelModalShow = (idReserva) => {
    // Encontrar a reserva completa usando o idReserva
    const reserva = reservations.find((res) => res.idReserva === idReserva);
    
    // Verifique se a reserva existe e então defina `reservationToCancel`
    if (reserva) {
      setReservationToCancel(reserva);
      setShowCancelModal(true);
    } else {
      toast.error("Reserva não encontrada.");
    }
  };
  

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
    setReservationToCancel(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredReservations = reservations.filter((res) => {
    const matchesCar = filters.carro_placa
      ? carDetails[res.carroId]?.placa.includes(filters.carro_placa)
      : true;

    const matchesDriver = filters.motorista_cpf
      ? (driverDetails[res.motoristaId]?.cpf?.toString() || "").includes(filters.motorista_cpf)
      : true;

    const matchesStatus = filters.status ? res.status === filters.status : true;
    const matchesDate = filters.data_fim ? res.dataFim === filters.data_fim : true;

    return matchesCar && matchesDriver && matchesStatus && matchesDate;
  });

  const isAnyFilterActive = Object.values(filters).some(value => value !== "");

  const confirmDeleteReservation = (reservation) => {
    setReservationToDelete(reservation);
    setShowDeleteModal(true);
  };

  const handleDeleteReservation = async () => {
    if (!reservationToDelete) return;

    try {
      const response = await fetch(`${API_URL}/reservas/${reservationToDelete.idReserva}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setReservations((prev) => prev.filter((res) => res.idReserva !== reservationToDelete.idReserva));
        toast.success("Reserva excluída com sucesso!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erro ao excluir reserva.");
      }
    } catch (error) {
      console.error("Erro ao excluir reserva", error);
      toast.error("Erro ao excluir reserva.");
    }

    setShowDeleteModal(false);
  };

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
      {/* Formulário de cadastro de reserva */}
      <div className="position-relative">
        {availableCars.length === 0 || availableDrivers.length === 0 ? (
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center text-white">
            <div className="alert alert-warning text-center">
              Não há carros ou motoristas disponíveis no momento. Tente novamente mais tarde.
            </div>
          </div>
        ) : null}

        <form className="row g-3 mb-4">
          <div className="col-md-4">
            <label htmlFor="carroId" className="form-label">
              Selecione o Carro
            </label>
            <select
              className="form-select"
              id="carroId"
              name="carroId"
              value={newReservation.carroId}
              onChange={handleInputChange}
              disabled={availableCars.length === 0 || availableDrivers.length === 0}
            >
              <option value="">Selecione...</option>
              {availableCars.map((car) => (
                <option key={car.idCarro} value={car.idCarro}>
                  {car.modelo} - {car.placa}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="motoristaId" className="form-label">
              Selecione o Motorista
            </label>
            <select
              className="form-select"
              id="motoristaId"
              name="motoristaId"
              value={newReservation.motoristaId}
              onChange={handleInputChange}
              disabled={availableCars.length === 0 || availableDrivers.length === 0}
            >
              <option value="">Selecione...</option>
              {availableDrivers.map((driver) => (
                <option key={driver.idMotorista} value={driver.idMotorista}>
                  {driver.nome} - {driver.cpf}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="dataFim" className="form-label">
              Data de Fim
            </label>
            <input
              type="date"
              className="form-control"
              id="dataFim"
              name="dataFim"
              value={newReservation.dataFim}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-12 mt-3">
            <button
              type="button"
              className="btn btn-info"
              onClick={handleConfirmModalShow}
              disabled={availableCars.length === 0 || availableDrivers.length === 0}
            >
              Criar Reserva
            </button>
          </div>
        </form>
      </div>

      {/* Filtros */}
    <form className="row g-3 mb-4">
    <div className="card-header bg-info text-white">
    <h5><i className="bi bi-funnel"></i> Filtros</h5>
  </div>
      <div className="col-md-3">
        <label htmlFor="carro_placa" className="form-label">
          Placa do Carro
        </label>
        <input
          type="text"
          className="form-control"
          id="carro_placa"
          name="carro_placa"
          placeholder="Ex: YQA7B12"
          value={filters.carro_placa}
          onChange={handleFilterChange}
        />
      </div>
      <div className="col-md-3">
        <label htmlFor="motorista_cpf" className="form-label">
          CPF do Motorista
        </label>
        <input
          type="text"
          className="form-control"
          id="motorista_cpf"
          name="motorista_cpf"
          placeholder="Ex: 48492974800"
          value={filters.motorista_cpf}
          onChange={handleFilterChange}
        />
      </div>
      <div className="col-md-3">
        <label htmlFor="status" className="form-label">
          Status
        </label>
        <select
          className="form-select"
          id="status"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">Selecione...</option>
          <option value="Ativa">Ativa</option>
          <option value="Cancelada">Cancelada</option>
          <option value="Concluída">Concluída</option>
        </select>
      </div>
      <div className="col-md-3">
        <label htmlFor="data_fim" className="form-label">
          Data de Fim
        </label>
        <input
          type="date"
          className="form-control"
          id="data_fim"
          name="data_fim"
          value={filters.data_fim}
          onChange={handleFilterChange}
        />
      </div>

      {/* Botão Limpar Filtros */}
      {isAnyFilterActive && (
        <div className="col-md-12 mt-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={clearFilters}
          >
            <i className="bi bi-x-circle"></i> Limpar Filtros
          </button>
        </div>
      )}
    </form>

{/* Tabela de reservas */}
<table className="table table-striped table-hover">
  <thead className="table-dark">
    <tr>
      <th>Carro</th>
      <th>Motorista</th>
      <th>Data de Fim</th>
      <th>Status</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {loading ? (
      <tr>
        <td colSpan="5" className="text-center">Carregando...</td>
      </tr>
    ) : filteredReservations.length === 0 ? (
      <tr>
        <td colSpan="5" className="text-center">Nenhuma reserva encontrada.</td>
      </tr>
    ) : (
      filteredReservations.map((res) => {
        const car = carDetails[res.carroId];
        const driver = driverDetails[res.motoristaId];
        return (
          <tr key={res.idReserva}>
            <td>{car ? `${car.modelo} - ${car.placa}` : "Carro não encontrado"}</td>
            <td>{driver ? `${driver.nome} - ${driver.cpf}` : "Motorista não encontrado"}</td>
            <td>{res.dataFim}</td>
            <td>
              <span
                className={`badge ${
                  res.status === "Ativa"
                    ? "bg-success"
                    : res.status === "Cancelada"
                    ? "bg-danger"
                    : res.status === "Concluída"
                    ? "bg-info"
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
                  onClick={() => handleCancelModalShow(res.idReserva)}
                >
                  <i className="bi bi-x-circle"></i> Cancelar
                </button>
              )}
              {res.status === "Concluída" || res.status === "Cancelada" ? (
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => confirmDeleteReservation(res)}
                >
                  <i className="bi bi-trash"></i> Excluir
                </button>
              ) : null}
            </td>
          </tr>
        );
      })
    )}
  </tbody>
</table>

    </div>
  </div>
</main>


{/* Modal de Cancelamento de Reserva */}
<Modal show={showCancelModal} onHide={handleCancelModalClose}>
  <Modal.Header closeButton>
    <Modal.Title className="text-dark"><i className="bi bi-x-circle"></i> Cancelar Reserva</Modal.Title>
  </Modal.Header>
  <Modal.Body className="text-dark">
    {reservationToCancel && carDetails[reservationToCancel.carroId] && driverDetails[reservationToCancel.motoristaId] ? (
      <>
        <div className="mb-3">
          <h5><i className="bi bi-person-fill"></i> Motorista</h5>
          <p>
            <strong>Nome:</strong> {driverDetails[reservationToCancel.motoristaId].nome} <br />
            <strong>CPF:</strong> {driverDetails[reservationToCancel.motoristaId].cpf}
          </p>
        </div>
        
        <div className="mb-3">
          <h5><i className="bi bi-car-front"></i> Carro</h5>
          <p>
            <strong>Modelo:</strong> {carDetails[reservationToCancel.carroId].modelo} <br />
            <strong>Placa:</strong> {carDetails[reservationToCancel.carroId].placa}
          </p>
        </div>
        
        <div className="mb-3">
          <h5><i className="bi bi-calendar-date"></i> Data de Fim</h5>
          <p><strong>{formatDate(reservationToCancel.dataFim)}</strong></p>
        </div>

        <div className="alert alert-warning" role="alert">
          <strong>Atenção:</strong> Ao cancelar esta reserva, o carro ficará disponível para outras reservas e o motorista poderá realizar novas alocações.
        </div>
      </>
    ) : (
      <p>Carregando detalhes...</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCancelModalClose}>
      Não, Manter Reserva
    </Button>
    <Button variant="danger" onClick={handleCancelReservation}>
      Sim, Cancelar Reserva
    </Button>
  </Modal.Footer>
</Modal>

{/* Modal de Confirmação de Exclusão */}
{showDeleteModal && (
  <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
    <Modal.Header closeButton>
      <Modal.Title className="text-dark"><i className="bi bi-trash"></i> Confirmar Exclusão</Modal.Title>
    </Modal.Header>
    <Modal.Body className="text-dark">
      {reservationToDelete && carDetails[reservationToDelete.carroId] && driverDetails[reservationToDelete.motoristaId] ? (
        <>
          <div className="mb-3">
            <h5><i className="bi bi-person-fill"></i> Motorista</h5>
            <p>
              <strong>Nome:</strong> {driverDetails[reservationToDelete.motoristaId].nome} <br />
              <strong>CPF:</strong> {driverDetails[reservationToDelete.motoristaId].cpf}
            </p>
          </div>
          <div className="mb-3">
            <h5><i className="bi bi-car-front"></i> Carro</h5>
            <p>
              <strong>Modelo:</strong> {carDetails[reservationToDelete.carroId].modelo} <br />
              <strong>Placa:</strong> {carDetails[reservationToDelete.carroId].placa}
            </p>
          </div>
          <div className="mb-3">
            <h5><i className="bi bi-calendar-date"></i> Data de Fim</h5>
            <p><strong>{formatDate(reservationToDelete.dataFim)}</strong></p>
          </div>
          <div className="alert alert-warning" role="alert">
            <strong>Atenção:</strong> Ao confirmar, a reserva será removida permanentemente.
          </div>
        </>
      ) : (
        <p>Carregando detalhes...</p>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
        Não, Manter Reserva
      </Button>
      <Button variant="danger" onClick={handleDeleteReservation}>
        Sim, Excluir Reserva
      </Button>
    </Modal.Footer>
  </Modal>
)}




      <Footer />
      <ToastContainer />
    </div>
  );
};

export default CarReservation;
