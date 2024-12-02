import React, { useState, useEffect } from "react";
import { API_URL } from "../App";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./TripRegistration.css";

const TripRegistrationEntry = () => {
  const [cars, setCars] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedCar, setSelectedCar] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [entryData, setEntryData] = useState({
    quilometragemEntrada: "",
    nivelCombustivelEntrada: "",  // Novo campo para o nível de combustível de entrada
  });
  const [showModal, setShowModal] = useState(false);
  const [carDetails, setCarDetails] = useState({});
  const [driverDetails, setDriverDetails] = useState({});
  const [formLocked, setFormLocked] = useState(true); // Estado para bloquear/desbloquear o formulário
  const [currentTime, setCurrentTime] = useState(""); // Estado para armazenar o horário atual
  const [selectedTime, setSelectedTime] = useState(""); // Estado para armazenar o horário selecionado (fixado)
  const navigate = useNavigate();

  // Atualiza o horário atual a cada segundo
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      setCurrentTime(currentDate.toLocaleString()); // Exibe data e hora
    }, 1000);

    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Fetch dos carros e motoristas
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/registros/em-atividade`);
        const data = await response.json();

        if (data.carrosReservados && data.motoristasDisponiveis) {
          setCars(data.carrosReservados);
          setDrivers(data.motoristasDisponiveis);

          // Obter detalhes dos carros e motoristas
          const carDetails = {};
          const driverDetails = {};

          data.carrosReservados.forEach((car) => {
            carDetails[car.idCarro] = car;
          });
          data.motoristasDisponiveis.forEach((driver) => {
            driverDetails[driver.idMotorista] = driver;
          });

          setCarDetails(carDetails);
          setDriverDetails(driverDetails);
        } else {
          toast.error("Carros ou motoristas não encontrados.");
        }
      } catch (error) {
        toast.error("Erro ao carregar os dados.");
      }
    };

    fetchData();
  }, []);

  const handleCarChange = (e) => setSelectedCar(Number(e.target.value));
  const handleDriverChange = (e) => setSelectedDriver(e.target.value);
  const handleInputChange = (e) => setEntryData({ ...entryData, [e.target.name]: e.target.value });

  // Verificar se todos os campos foram preenchidos
  useEffect(() => {
    if (selectedCar && selectedDriver && entryData.quilometragemEntrada && entryData.nivelCombustivelEntrada) {
      setFormLocked(false); // Desbloquear o formulário
    } else {
      setFormLocked(true); // Bloquear o formulário
    }
  }, [selectedCar, selectedDriver, entryData.quilometragemEntrada, entryData.nivelCombustivelEntrada]);

  const handleSubmit = async () => {
    if (!selectedCar || !selectedDriver || !entryData.quilometragemEntrada || !entryData.nivelCombustivelEntrada) {
      toast.warn("Todos os campos são obrigatórios.");
      return;
    }

    // Validação do combustível de entrada
    const car = carDetails[selectedCar];
    if (entryData.nivelCombustivelEntrada <= 0 || entryData.nivelCombustivelEntrada > car.capacidadeTanque) {
      toast.error(`O nível de combustível deve ser maior que 0 e menor ou igual a capacidade do tanque (${car.capacidadeTanque} litros).`);
      return;
    }

    const url = `${API_URL}/registros/registroEntrada?carroId=${selectedCar}&motoristaId=${selectedDriver}&quilometragemEntrada=${entryData.quilometragemEntrada}&nivelCombustivelEntradaInformado=${entryData.nivelCombustivelEntrada}`;

    try {
      const response = await fetch(url, { method: "PUT" });

      const responseText = await response.text();

      if (!response.ok) {
        toast.error(`${responseText}`);
        return;
      }

      toast.success("Entrada registrada com sucesso!");
      setTimeout(() => navigate("/trip-history"), 2000);
    } catch (error) {
      toast.error("Erro ao registrar a entrada. Verifique sua conexão ou tente novamente.");
      console.error("Erro ao registrar a entrada:", error);
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Função para fixar o horário ao clicar no botão
  const handleFixTime = () => {
    setSelectedTime(currentTime); // Fixar o horário atual
  };

  return (
    <div className="register-trip-entry">
      <Header />
      <main className="container my-5">
        <div className="card shadow">
          <div className="card-header bg-warning text-white">
            <h4>
              <i className="bi bi-box-arrow-in-left"></i> Registrar Entrada
            </h4>
          </div>
          <div className="card-body">
            {(!cars.length || !drivers.length) && (
              <div className="alert alert-warning text-center">
                <strong>Não há carros ou motoristas disponíveis no momento!</strong>
              </div>
            )}
            <form>
              <div className="mb-3">
                <label htmlFor="car" className="form-label">Carro</label>
                <select id="car" className="form-select" value={selectedCar} onChange={handleCarChange} disabled={cars.length === 0 || drivers.length == 0}>
                  <option value="">Selecione um carro</option>
                  {cars.map((car) => (
                    <option key={car.idCarro} value={car.idCarro}>
                      {car.modelo} - {car.placa}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="driver" className="form-label">Motorista</label>
                <select id="driver" className="form-select" value={selectedDriver} onChange={handleDriverChange} disabled={cars.length === 0 || drivers.length == 0}>
                  <option value="">Selecione um motorista</option>
                  {drivers.map((driver) => (
                    <option key={driver.idMotorista} value={driver.idMotorista}>
                      {driver.nome} - {driver.cpf}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="quilometragemEntrada" className="form-label">Quilometragem de Entrada (km)</label>
                <input
                  type="number"
                  id="quilometragemEntrada"
                  name="quilometragemEntrada"
                  className="form-control"
                  value={entryData.quilometragemEntrada}
                  onChange={handleInputChange}
                  required
                  disabled={cars.length === 0 || drivers.length == 0}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="nivelCombustivelEntrada" className="form-label">Nível de Combustível de Entrada (litros)</label>
                <input
                  type="number"
                  id="nivelCombustivelEntrada"
                  name="nivelCombustivelEntrada"
                  className="form-control"
                  value={entryData.nivelCombustivelEntrada}
                  onChange={handleInputChange}
                  required
                  disabled={cars.length === 0 || drivers.length == 0}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="horarioEntrada" className="form-label">Horário da Entrada</label>
                <input
                  type="text"
                  id="horarioEntrada"
                  name="horarioEntrada"
                  className="form-control"
                  value={selectedTime || currentTime} // Exibe o horário fixo ou o horário atual
                  readOnly
                  disabled
                />
              </div>

              <button
                type="button"
                className="btn btn-warning w-100"
                onClick={() => {
                  if (selectedCar && selectedDriver && entryData.quilometragemEntrada && entryData.nivelCombustivelEntrada) {
                    handleFixTime(); // Fixar o horário ao clicar
                    handleOpenModal();
                  } else {
                    toast.warn("Todos os campos são obrigatórios.");
                  }
                }}
                disabled={formLocked} // Desabilita o botão quando os campos não estão preenchidos
              >
                Registrar Entrada
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Modal de Confirmação */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Registro de Entrada</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-dark">
          {selectedCar && selectedDriver ? (
            <>
              <div className="mb-3">
                <h5><i className="bi bi-car-front"></i> Carro</h5>
                <p>
                  <strong>Modelo:</strong> {carDetails[selectedCar]?.modelo} <br />
                  <strong>Placa:</strong> {carDetails[selectedCar]?.placa}
                </p>
              </div>
              
              <div className="mb-3">
                <h5><i className="bi bi-person-fill"></i> Motorista</h5>
                <p>
                  <strong>Nome:</strong> {driverDetails[selectedDriver]?.nome} <br />
                  <strong>CPF:</strong> {driverDetails[selectedDriver]?.cpf}
                </p>
              </div>
              
              <div className="mb-3">
                <h5><i className="bi bi-calendar-date"></i> Quilometragem de Entrada</h5>
                <p><strong>{entryData.quilometragemEntrada} km</strong></p>
              </div>

              <div className="mb-3">
                <h5><i className="bi bi-tachometer"></i> Nível de Combustível</h5>
                <p><strong>{entryData.nivelCombustivelEntrada} litros</strong></p>
              </div>

              <div className="mb-3">
                <h5><i className="bi bi-clock"></i> Horário</h5>
                <p><strong>{selectedTime || currentTime}</strong></p>
              </div>

              <div className="alert alert-info" role="alert">
                <strong>Importante:</strong> Ao confirmar, você irá registrar a entrada com as informações acima.
              </div>
            </>
          ) : (
            <p>Carregando dados...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleSubmit();
              handleCloseModal();
            }}
          >
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
      <Footer />
    </div>
  );
};

export default TripRegistrationEntry;
