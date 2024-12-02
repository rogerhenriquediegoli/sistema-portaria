import React, { useState, useEffect } from "react";
import "./CarManagement.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { API_URL } from '../../App'; // Defina a URL da sua API
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CarManagement.css";

const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({
    placa: "",
    modelo: "",
    status: "Aguardando Revisão",
    capacidadeTanque: "",
    consumoMedio: "",
    quilometragemAtual: "",
  });
  const [editingCar, setEditingCar] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false); // Controle do modal de confirmação
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Controle do modal de exclusão
  const [carToDelete, setCarToDelete] = useState(null); // Carro que será excluído
  const [loading, setLoading] = useState(true); // Estado para controle de carregamento

  // Carregar os carros ao iniciar
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true); // Iniciar carregamento
      try {
        const response = await fetch(`${API_URL}/carros`);
        if (response.ok) {
          const data = await response.json();
          setCars(data);
        } else {
          console.error("Erro ao carregar os carros.");
        }
      } catch (error) {
        console.error("Erro de rede", error);
      } finally {
        setLoading(false); // Finalizar carregamento
      }
    };
    fetchCars();
  }, []);

  // Função para lidar com mudanças no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar({ ...newCar, [name]: value });
  };

  // Validação dos dados do carro
  const validateCarData = (car) => {
    const { capacidadeTanque, consumoMedio, quilometragemAtual } = car;
    return (
      capacidadeTanque > 0 &&
      consumoMedio > 0 &&
      quilometragemAtual >= 0
    );
  };

  // Função para adicionar um novo carro
  const handleAddCar = async () => {
    if (!newCar.placa || !newCar.modelo || !validateCarData(newCar)) {
      toast.error("Preencha todos os campos corretamente.");
      return;
    }

    // Exibir modal de confirmação
    setShowModal(true);
  };

  // Confirmação de cadastro no modal
  const confirmAddCar = async () => {
    try {
      const response = await fetch(`${API_URL}/carros`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCar),
      });
      if (response.ok) {
        const newCarData = await response.json();
        setCars([...cars, newCarData]);
        setNewCar({
          placa: "",
          modelo: "",
          status: "Aguardando Revisão",
          capacidadeTanque: "",
          consumoMedio: "",
          quilometragemAtual: "",
        });
        toast.success("Carro cadastrado com sucesso!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erro ao cadastrar carro.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar carro", error);
      toast.error("Erro ao cadastrar carro.");
    }
    setShowModal(false); // Fechar modal
  };

  // Função para editar um carro
  const handleEditCar = (car) => {
    setEditingCar(car);
    setNewCar({
      placa: car.placa,
      modelo: car.modelo,
      status: car.status === "Disponível" ? "Aguardando Revisão" : car.status,
      capacidadeTanque: car.capacidadeTanque,
      consumoMedio: car.consumoMedio,
      quilometragemAtual: car.quilometragemAtual,
    });
  };

  // Função para salvar as alterações de um carro
  const handleSaveCar = async () => {
    if (!newCar.placa || !newCar.status) {
      toast.error("Preencha a placa e o status.");
      return;
    }

    // Exibir modal de confirmação antes de salvar
    setShowModal(true);
  };

  // Confirmação de atualização no modal
  const confirmSaveCar = async () => {
    try {
      // Corpo da requisição de atualização com os campos placa e status apenas
      const response = await fetch(`${API_URL}/carros/${editingCar.idCarro}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placa: newCar.placa,
          status: newCar.status
        }),
      });
      if (response.ok) {
        const updatedCar = await response.json();
        setCars(cars.map((car) => (car.idCarro === updatedCar.idCarro ? updatedCar : car)));
        setEditingCar(null); // Resetando a edição
        toast.success("Carro atualizado com sucesso!");
      } else {
        const errorData = await response.text();
        toast.error(errorData);
      }
    } catch (error) {
      console.error("Erro ao salvar as alterações", error);
      toast.error("Erro ao salvar as alterações.");
    }
    setShowModal(false); // Fechar modal
  };

  // Função para excluir um carro
  const handleDeleteCar = async () => {
    if (!carToDelete) return;

    try {
      const response = await fetch(`${API_URL}/carros/${carToDelete.idCarro}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCars(cars.filter((car) => car.idCarro !== carToDelete.idCarro));
        toast.success("Carro excluído com sucesso, incluindo reservas e registros de viagem!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erro ao excluir carro.");
      }
    } catch (error) {
      console.error("Erro ao excluir carro", error);
      toast.error("Erro ao excluir carro.");
    }

    setShowDeleteModal(false); // Fechar o modal de exclusão
  };

  // Função para confirmar exclusão do carro
  const confirmDeleteCar = (car) => {
    setCarToDelete(car); // Definir o carro a ser excluído
    setShowDeleteModal(true); // Exibir o modal de confirmação de exclusão
  };

  // Função para sair da edição e voltar ao cadastro normal
  const handleCancelEdit = () => {
    setEditingCar(null); // Resetar o estado de edição
    setNewCar({
      placa: "",
      modelo: "",
      status: "Aguardando Revisão",
      capacidadeTanque: "",
      consumoMedio: "",
      quilometragemAtual: "",
    }); // Resetar os dados do carro
  };

  // Filtragem dos carros
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.placa.toLowerCase().includes(search.toLowerCase()) ||
      car.modelo.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? car.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="car-management">
      <Header />
      <main className="container my-5">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h4>
              <i className="bi bi-car-front"></i> Gerenciamento de Carros
            </h4>
          </div>
          <div className="card-body">
            {/* Formulário de cadastro/edição */}
            <form className="row g-3 mb-4">
              <div className="col-md-3">
                <label htmlFor="placa" className="form-label">Placa</label>
                <input
                  type="text"
                  className="form-control"
                  id="placa"
                  name="placa"
                  value={newCar.placa}
                  onChange={handleInputChange}
                  placeholder="Ex.: ABC1D45"
                />
              </div>

              {/* Modelo não editável durante a edição */}
              {!editingCar && (
                <div className="col-md-3">
                  <label htmlFor="modelo" className="form-label">Modelo</label>
                  <input
                    type="text"
                    className="form-control"
                    id="modelo"
                    name="modelo"
                    value={newCar.modelo}
                    onChange={handleInputChange}
                    placeholder="Ex.: Civic"
                  />
                </div>
              )}

              <div className="col-md-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={newCar.status}
                  onChange={handleInputChange}
                >
                  <option value="Aguardando Revisão">Aguardando Revisão</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              {/* Campos desabilitados durante a edição */}
              {!editingCar && (
                <>
                  <div className="col-md-3">
                    <label htmlFor="capacidadeTanque" className="form-label">Capacidade do Tanque (L)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="capacidadeTanque"
                      name="capacidadeTanque"
                      value={newCar.capacidadeTanque}
                      onChange={handleInputChange}
                      placeholder="Ex.: 50"
                      min="1"
                    />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="consumoMedio" className="form-label">Consumo Médio (Km/L)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="consumoMedio"
                      name="consumoMedio"
                      value={newCar.consumoMedio}
                      onChange={handleInputChange}
                      placeholder="Ex.: 12.5"
                      min="1"
                    />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="quilometragemAtual" className="form-label">Quilometragem Atual (Km)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="quilometragemAtual"
                      name="quilometragemAtual"
                      value={newCar.quilometragemAtual}
                      onChange={handleInputChange}
                      placeholder="Ex.: 12000"
                      min="0"
                    />
                  </div>
                </>
              )}

              <div className="col-md-12 text-end">
                {editingCar ? (
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancelEdit}
                    >
                      <i className="bi bi-x-circle"></i> Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleSaveCar}
                    >
                      <i className="bi bi-check-circle"></i> Salvar Alterações
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddCar}
                  >
                    <i className="bi bi-plus-circle"></i> Adicionar Carro
                  </button>
                )}
              </div>

            </form>

            {/* Filtro de busca */}
            <form className="row g-3 mb-4">
            <div className="card-header bg-primary text-white">
              <h5><i className="bi bi-funnel"></i> Filtros</h5>
            </div>
              <div className="col-md-6">
                <label htmlFor="search" className="form-label">Buscar por placa ou modelo</label>
                <input
                  type="text"
                  className="form-control"
                  id="search"
                  placeholder="Ex.: ABC1D45 ou Civic"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="statusFilter" className="form-label">Status</label>
                <select
                  className="form-select"
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Todos os Status</option>
                  <option value="Aguardando Revisão">Aguardando Revisão</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Disponível">Disponível</option>
                  <option value="Reservado">Reservado</option>
                  <option value="Em uso">Em uso</option>
                </select>
              </div>
            </form>

            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Placa</th>
                  <th>Modelo</th>
                  <th>Status</th>
                  <th>Capacidade do Tanque</th>
                  <th>Consumo Médio</th>
                  <th>Quilometragem Atual</th>
                  <th>Nível de Combustível Atual</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? ( // Verifica se está carregando
                  <tr>
                    <td colSpan="8" className="text-center">Carregando...</td>
                  </tr>
                ) : filteredCars.length === 0 ? ( // Verifica se não há carros
                  <tr>
                    <td colSpan="8" className="text-center">Nenhum carro encontrado</td>
                  </tr>
                ) : (
                  filteredCars.map((car) => (
                    <tr key={car.idCarro}>
                      <td>{car.placa}</td>
                      <td>{car.modelo}</td>
                      <td>{car.status}</td>
                      <td>{car.capacidadeTanque} L</td>
                      <td>{car.consumoMedio} Km/L</td>
                      <td>{car.quilometragemAtual} Km</td>
                      <td>{car.nivelCombustivelAtual ?? "null"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEditCar(car)}
                          disabled={car.status !== "Disponível" && car.status !== "Inativo" && car.status !== "Aguardando Revisão"} // Desabilita se o status não for permitido
                        >
                          <i className="bi bi-pencil"></i> Editar
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => confirmDeleteCar(car)} // Exibir modal de confirmação de exclusão
                          disabled={car.status !== "Disponível" && car.status !== "Inativo" && car.status !== "Aguardando Revisão"} // Desabilita se o status não for válido para exclusão
                        >
                          <i className="bi bi-trash"></i> Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

          </div>
        </div>
      </main>
      <Footer />

      {/* Modal de confirmação */}
      {showModal && (
        <div className="modal show" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog" style={{ marginTop: "10%" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: "black" }}>
                  <i className="bi bi-check-circle"></i> Confirmar {editingCar ? "Atualização" : "Cadastro"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body" style={{ color: "black" }}>
                <div className="mb-3">
                  <h5><i className="bi bi-car-front"></i> Carro</h5>
                  <p>
                    <strong>Placa:</strong> {newCar.placa} <br />
                    <strong>Modelo:</strong> {newCar.modelo} <br />
                    <strong>Status:</strong> {newCar.status} <br />
                    <strong>Capacidade do Tanque:</strong> {newCar.capacidadeTanque} L <br />
                    <strong>Consumo Médio:</strong> {newCar.consumoMedio} Km/L <br />
                    <strong>Quilometragem Atual:</strong> {newCar.quilometragemAtual} Km
                  </p>
                </div>
                <div className="alert alert-info" role="alert">
                  <strong>Importante:</strong> Ao confirmar, você {editingCar ? "atualiza" : "cadastra"} o carro com as informações acima.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={editingCar ? confirmSaveCar : confirmAddCar}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Exclusão */}
      {showDeleteModal && (
        <div className="modal show" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog" style={{ marginTop: "10%" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: "black" }}>
                  <i className="bi bi-trash"></i> Confirmar Exclusão
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body" style={{ color: "black" }}>
                {carToDelete && (
                  <>
                    <p><strong>Placa:</strong> {carToDelete.placa}</p>
                    <p><strong>Modelo:</strong> {carToDelete.modelo}</p>
                    <p><strong>Status:</strong> {carToDelete.status}</p>
                    <p><strong>Capacidade do Tanque:</strong> {carToDelete.capacidadeTanque} L</p>
                    <p><strong>Consumo Médio:</strong> {carToDelete.consumoMedio} Km/L</p>
                    <p><strong>Quilometragem Atual:</strong> {carToDelete.quilometragemAtual} Km</p>
                    <div className="alert alert-warning" role="alert">
                      <strong>Atenção:</strong> Ao confirmar, o carro será removido permanentemente, incluindo todos os registros de viagem e reserva relacionados.
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={handleDeleteCar}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ToastContainer */}
      <ToastContainer />
    </div>
  );
};

export default CarManagement;
