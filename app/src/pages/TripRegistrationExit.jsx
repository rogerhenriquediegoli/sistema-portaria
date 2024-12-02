import React, { useState, useEffect } from "react";
import { API_URL } from "../App"; // Importando a URL da API
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Importando o useNavigate
import "react-toastify/dist/ReactToastify.css";
import "./TripRegistration.css";

const TripRegistrationExit = () => {
  const [cars, setCars] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedCar, setSelectedCar] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [tripData, setTripData] = useState({
    kilometragem: 0,
    nivelCombustivel: 0,
    horarioSaida: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [carDetails, setCarDetails] = useState({});
  const [driverDetails, setDriverDetails] = useState({});
  const navigate = useNavigate(); // Usando o useNavigate para redirecionamento
  const [currentTime, setCurrentTime] = useState(""); // Estado para armazenar o horário atual
  const [selectedTime, setSelectedTime] = useState(""); // Estado para armazenar o horário selecionado (fixado)

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
        const response = await fetch(`${API_URL}/registros/validos`);
        const data = await response.json();

        if (data.carrosReservados && data.motoristasDisponiveis) {
          setCars(data.carrosReservados);
          setDrivers(data.motoristasDisponiveis);

          // Obter detalhes dos carros e motoristas
          const carDetails = {};
          const driverDetails = {};

          for (let car of data.carrosReservados) {
            carDetails[car.idCarro] = car;
          }
          for (let driver of data.motoristasDisponiveis) {
            driverDetails[driver.idMotorista] = driver;
          }

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

  const handleCarChange = (e) => {
    const carId = Number(e.target.value); // Garantir que seja um número
    setSelectedCar(carId);

    if (carId === -1) {
      // Limpar dados de quilometragem, nível de combustível e horário
      setTripData({
        kilometragem: 0,
        nivelCombustivel: 0,
        horarioSaida: "",
      });
    } else {
      // Lógica para preencher os dados de viagem quando o carro for selecionado
      const selectedCarData = cars.find((car) => car.idCarro === carId);
      if (selectedCarData) {
        setTripData({
          kilometragem: selectedCarData.quilometragemAtual,
          nivelCombustivel: selectedCarData.nivelCombustivelAtual,
          horarioSaida: new Date().toISOString().slice(0, 16),  // Atualiza o horário de saída para o momento atual
        });
        
      }
    }
  };

  const handleDriverChange = (e) => setSelectedDriver(e.target.value);

  const handleInputChange = (e) => setTripData({ ...tripData, [e.target.name]: e.target.value });

  useEffect(() => {
    if (selectedCar) {
      const selectedCarData = cars.find((car) => car.idCarro === selectedCar);
      if (selectedCarData) {
        setTripData({
          kilometragem: selectedCarData.quilometragemAtual,
          nivelCombustivel: selectedCarData.nivelCombustivelAtual,
          horarioSaida: (() => {
            const now = new Date();
            const currentHour = selectedCarData.horarioSaida ? new Date(selectedCarData.horarioSaida).getHours() : now.getHours();
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(currentHour).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
          })(),

        });
      }
    }
  }, [selectedCar, cars]);

  const handleSubmit = async (e) => {

    // Validação de campos obrigatórios
    if (!selectedCar || !selectedDriver || !tripData.kilometragem || !tripData.nivelCombustivel || !tripData.horarioSaida) {
      toast.warn("Todos os campos são obrigatórios.");
      return;
    }

    const url = `${API_URL}/registros/registroSaida?carroId=${selectedCar}&motoristaId=${selectedDriver}`;

    try {
      // Enviar a requisição
      const res = await fetch(url, { method: "POST" });

      // Verificar status da resposta
      if (!res.ok) {
        const responseText = await res.text(); // Ler a resposta uma vez
        let errorMessage = "Erro desconhecido";

        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData?.message || errorMessage;
        } catch (jsonError) {
          errorMessage = responseText || errorMessage;
        }

        toast.error(`${errorMessage}`);
        console.error("Erro na resposta do servidor:", errorMessage);
        return;
      }

      // Processar a resposta
      const responseText = await res.text(); // Ler a resposta novamente
      let registroSaida = { message: responseText }; // Caso a resposta seja uma string

      try {
        registroSaida = JSON.parse(responseText);
      } catch (error) {
        console.log("Erro ao parsear JSON:", error);
      }

      if (registroSaida?.message) {
        toast.success(registroSaida.message);
      } else {
        // Atualizar carros e motoristas disponíveis
        setCars((prevCars) => prevCars.filter((car) => car.idCarro !== selectedCar));
        setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver.idMotorista !== selectedDriver));
        setTripData({
          kilometragem: 0,
          nivelCombustivel: 0,
          horarioSaida: "",
        });

        // Exibir mensagem de sucesso
        toast.success("Saída registrada com sucesso!");
        // Redirecionar ou realizar outras ações após sucesso
        setShowModal(false);
        setTimeout(() => navigate("/trip-history"), 2000);
      }
    } catch (error) {
      console.error("Erro ao registrar a saída:", error);
    }
  };

  const handleOpenModal = () => {
    setSelectedTime(currentTime); // Fixar o horário atual ao abrir o modal
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

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
            {(!cars.length || !drivers.length) && (
              <div className="alert alert-warning text-center">
                <strong>Não há carros ou motoristas disponíveis no momento!</strong>
              </div>
            )}
            <form>
              <div className="mb-3">
                <label htmlFor="car" className="form-label">Carro</label>
                <select id="car" className="form-select" value={selectedCar} onChange={handleCarChange} disabled={cars.length === 0 || drivers.length == 0}>
                  <option value="-1">Selecione um carro</option>
                  {cars.map((car) => (
                    <option key={car.idCarro} value={car.idCarro}>
                      {car.modelo} - {car.placa}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="driver" className="form-label">Motorista</label>


                <select id="driver" className="form-select" value={selectedDriver} onChange={handleDriverChange} disabled={drivers.length === 0 || cars.length === 0}>
                  <option value="">Selecione um motorista</option>
                  {drivers.map((driver) => (
                    <option key={driver.idMotorista} value={driver.idMotorista}>
                      {driver.nome} - {driver.cpf}
                    </option>
                  ))}
                </select>

              </div>

              <div className="mb-3">
                <label htmlFor="kilometragem" className="form-label">Quilometragem Atual (km)</label>
                <input
                  type="number"
                  id="kilometragem"
                  name="kilometragem"
                  className="form-control"
                  value={tripData.kilometragem}
                  onChange={handleInputChange}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label htmlFor="fuelLevel" className="form-label">Nível de Combustível Atual (L)</label>
                <input
                  type="number"
                  id="fuelLevel"
                  name="nivelCombustivel"
                  className="form-control"
                  value={tripData.nivelCombustivel}
                  onChange={handleInputChange}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label htmlFor="horarioSaida" className="form-label">Horário da Saída</label>
                <input
                  type="text"
                  id="horarioSaida"
                  name="horarioSaida"
                  className="form-control"
                  value={selectedTime || currentTime} // Exibe o horário fixo ou o horário atual
                  readOnly
                  disabled
                />
              </div>

              <button
                type="button"
                className="btn btn-success w-100"
                onClick={handleOpenModal}
                disabled={!selectedCar || !selectedDriver || !tripData.horarioSaida}
              >
                Registrar Saída
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Modal de Confirmação */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Registro de Saída</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-dark">
          <div className="mb-3">
            <h5><i className="bi bi-car-front"></i> Carro</h5>
            {selectedCar && carDetails[selectedCar] && (
              <p>
                <strong>Modelo:</strong> {carDetails[selectedCar].modelo} <br />
                <strong>Placa:</strong> {carDetails[selectedCar].placa}
              </p>
            )}
          </div>

          <div className="mb-3">
            <h5><i className="bi bi-person-fill"></i> Motorista</h5>
            {selectedDriver && driverDetails[selectedDriver] && (
              <p>
                <strong>Nome:</strong> {driverDetails[selectedDriver].nome} <br />
                <strong>CPF:</strong> {driverDetails[selectedDriver].cpf}
              </p>
            )}
          </div>

          <div className="mb-3">
            <h5><i className="bi bi-speedometer"></i> Quilometragem</h5>
            <p>{tripData.kilometragem} km</p>
          </div>

          <div className="mb-3">
            <h5><i className="bi bi-gas-pump"></i> Nível de Combustível</h5>
            <p>{tripData.nivelCombustivel} L</p>
          </div>

          <div className="mb-3">
            <h5><i className="bi bi-clock"></i> Horário</h5>
            <p><strong>{selectedTime || currentTime}</strong></p>
          </div>

          <div className="alert alert-info" role="alert">
            <strong>Importante:</strong> Ao confirmar, você registra a saída do veículo com as informações acima.
          </div>
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

export default TripRegistrationExit;
