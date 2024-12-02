import React, { useState, useEffect } from "react";
import "./DriverManagement.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_URL } from "../App"; // Defina a URL da sua API
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [newDriver, setNewDriver] = useState({
    cpf: "",
    nome: "",
    status: "Inativo",
    validadeCnh: "",
  });
  const [editingDriver, setEditingDriver] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [validadeCnhFilter, setValidadeCnhFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  // Carregar os motoristas ao iniciar
  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/motoristas`);
        if (response.ok) {
          const data = await response.json();
          setDrivers(data);
        } else {
          toast.error("Erro ao carregar os motoristas.");
        }
      } catch (error) {
        toast.error("Erro de rede. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  // Lidar com mudanças no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDriver({ ...newDriver, [name]: value });
  };

  // Validação de CPF simples
  const isValidCPF = (cpf) => /^[0-9]{11}$/.test(cpf);

  // Cadastro de um novo motorista
  const handleAddDriver = async () => {
    if (!newDriver.cpf || !isValidCPF(newDriver.cpf) || !newDriver.nome || !newDriver.validadeCnh) {
      toast.error("Preencha todos os campos corretamente.");
      return;
    }
    setShowModal(true);
  };

  // Confirmação de cadastro no modal
  const confirmAddDriver = async () => {
    try {
      const response = await fetch(`${API_URL}/motoristas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDriver),
      });

      if (response.ok) {
        const newDriverData = await response.json();
        setDrivers([...drivers, newDriverData]);
        setNewDriver({
          cpf: "",
          nome: "",
          status: "Inativo",
          validadeCnh: "",
        });
        toast.success("Motorista cadastrado com sucesso!");
      } else {
        const errorData = await response.text();
        toast.error(errorData);
      }
    } catch (error) {
      toast.error("Erro de rede. Não foi possível cadastrar o motorista.");
    }
    setShowModal(false);
  };

  // Edição de um motorista
  const handleEditDriver = (driver) => {
    setEditingDriver(driver);
    setNewDriver({
      cpf: driver.cpf,
      nome: driver.nome,
      status: driver.status,
      validadeCnh: driver.validadeCnh,
    });
  };

  // Salvar alterações no motorista
  const handleSaveDriver = async () => {
    if (!newDriver.status || !newDriver.validadeCnh) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    setShowModal(true);
  };

  // Confirmação de edição no modal
  const confirmSaveDriver = async () => {
    try {
      const response = await fetch(`${API_URL}/motoristas/${editingDriver.idMotorista}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newDriver.status,
          validadeCnh: newDriver.validadeCnh,
        }),
      });

      if (response.ok) {
        const updatedDriver = await response.json();
        setDrivers(
          drivers.map((driver) =>
            driver.idMotorista === updatedDriver.idMotorista ? updatedDriver : driver
          )
        );
        setEditingDriver(null);
        handleCancelEdit();
        toast.success("Motorista atualizado com sucesso!");
      } else {
        const errorData = await response.text();
        toast.error(errorData);
      }
    } catch (error) {
      toast.error("Erro de rede. Não foi possível atualizar o motorista.");
    }
    setShowModal(false);
  };

  // Exclusão de motorista
  const handleDeleteDriver = async () => {
    if (!driverToDelete) return;
    try {
      const response = await fetch(`${API_URL}/motoristas/${driverToDelete.idMotorista}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDrivers(drivers.filter((driver) => driver.idMotorista !== driverToDelete.idMotorista));
        toast.success("Motorista excluído com sucesso!");
      } else {
        const errorData = await response.text();
        toast.error(errorData);
      }
    } catch (error) {
      toast.error("Erro de rede. Não foi possível excluir o motorista.");
    }
    setShowDeleteModal(false);
  };

  // Confirmar exclusão
  const confirmDeleteDriver = (driver) => {
    setDriverToDelete(driver);
    setShowDeleteModal(true);
  };

  // Filtragem dos motoristas
  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.cpf.toString().includes(search) ||
      driver.nome.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? driver.status === statusFilter : true;
    const matchesValidadeCnh = validadeCnhFilter ? driver.validadeCnh === validadeCnhFilter : true;
    return matchesSearch && matchesStatus && matchesValidadeCnh;
  });

  // Função para limpar os campos do formulário
  const clearFormFields = () => {
    setNewDriver({
      cpf: "",
      nome: "",
      status: "Inativo",
      validadeCnh: "",
    });
    setEditingDriver(null);
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    clearFormFields();
    setShowModal(false);
  };

  return (
    <div className="driver-management">
      <Header />
      <main className="container my-5">
        <div className="card shadow">
          <div className="card-header bg-success text-white">
            <h4>
              <i className="bi bi-person-fill"></i> Gerenciamento de Motoristas
            </h4>
          </div>
          <div className="card-body">
            {/* Formulário de cadastro/edição */}
            <form className="row g-3 mb-4">
              <div className="col-md-3">
                <label htmlFor="cpf" className="form-label">CPF</label>
                <input
                  type="text"
                  className="form-control"
                  id="cpf"
                  name="cpf"
                  value={newDriver.cpf}
                  onChange={handleInputChange}
                  placeholder="Ex.: 12345678901"
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="nome" className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  id="nome"
                  name="nome"
                  value={newDriver.nome}
                  onChange={handleInputChange}
                  placeholder="Ex.: João Silva"
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={newDriver.status}
                  onChange={handleInputChange}
                >
                  <option value="Inativo">Inativo</option>
                  <option value="Disponível">Disponível</option>
                </select>
              </div>
              <div className="col-md-3">
                <label htmlFor="validadeCnh" className="form-label">Validade CNH</label>
                <input
                  type="date"
                  className="form-control"
                  id="validadeCnh"
                  name="validadeCnh"
                  value={newDriver.validadeCnh}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-12 text-end">
                {editingDriver ? (
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                      <i className="bi bi-x-circle"></i> Cancelar
                    </button>
                    <button type="button" className="btn btn-success" onClick={handleSaveDriver}>
                      <i className="bi bi-check-circle"></i> Salvar Alterações
                    </button>
                  </div>
                ) : (
                  <button type="button" className="btn btn-success" onClick={handleAddDriver}>
                    <i className="bi bi-plus-circle"></i> Adicionar Motorista
                  </button>
                )}
              </div>
            </form>

            {/* Filtro de busca */}
            <form className="row g-3 mb-4">
              <div className="card-header bg-success text-white">
                <h5><i className="bi bi-funnel"></i> Filtros</h5>
              </div>
              <div className="col-md-4">
                <label htmlFor="search" className="form-label">Buscar por CPF ou Nome</label>
                <input
                  type="text"
                  className="form-control"
                  id="search"
                  placeholder="Ex.: 12345678901 ou João Silva"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="statusFilter" className="form-label">Status</label>
                <select
                  className="form-select"
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Todos os Status</option>
                  <option value="Disponível">Disponível</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Em Viagem">Em Viagem</option>
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="validadeCnhFilter" className="form-label">Validade CNH</label>
                <input
                  type="date"
                  className="form-control"
                  id="validadeCnhFilter"
                  value={validadeCnhFilter}
                  onChange={(e) => setValidadeCnhFilter(e.target.value)}
                />
              </div>
            </form>

            {/* Tabela */}
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>CPF</th>
                    <th>Nome</th>
                    <th>Status</th>
                    <th>Validade CNH</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center">Carregando...</td>
                    </tr>
                  ) : filteredDrivers.length > 0 ? (
                    filteredDrivers.map((driver) => (
                      <tr key={driver.idMotorista}>
                        <td>{driver.cpf}</td>
                        <td>{driver.nome}</td>
                        <td>{driver.status}</td>
                        <td>{driver.validadeCnh}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEditDriver(driver)}
                            disabled={driver.status !== "Disponível" && driver.status !== "Inativo"}
                          >
                            <i className="bi bi-pencil"></i> Editar
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => confirmDeleteDriver(driver)}
                            disabled={driver.status !== "Disponível" && driver.status !== "Inativo"}
                          >
                            <i className="bi bi-trash"></i> Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">Nenhum motorista encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Confirmação de Cadastro ou Atualização */}
      {showModal && (
        <div className="modal show" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog" style={{ marginTop: "10%" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: "black" }}>
                  <i className="bi bi-check-circle"></i> Confirmar {editingDriver ? "Atualização" : "Cadastro"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body" style={{ color: "black" }}>
                <div className="mb-3">
                  <h5><i className="bi bi-person-fill"></i> Motorista</h5>
                  <p>
                    <strong>CPF:</strong> {newDriver.cpf} <br />
                    <strong>Nome:</strong> {newDriver.nome} <br />
                    <strong>Status:</strong> {newDriver.status} <br />
                    <strong>Validade CNH:</strong> {newDriver.validadeCnh}
                  </p>
                </div>
                <div className="alert alert-info" role="alert">
                  <strong>Importante:</strong> Ao confirmar, você {editingDriver ? 'atualiza' : 'cadastra'} o motorista com as informações acima.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={editingDriver ? confirmSaveDriver : confirmAddDriver}
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
                {driverToDelete && (
                  <>
                    <p><strong>CPF:</strong> {driverToDelete.cpf}</p>
                    <p><strong>Nome:</strong> {driverToDelete.nome}</p>
                    <p><strong>Status:</strong> {driverToDelete.status}</p>
                    <p><strong>Validade CNH:</strong> {driverToDelete.validadeCnh}</p>
                    <div className="alert alert-warning" role="alert">
                      <strong>Atenção:</strong> Ao confirmar, o motorista será removido permanentemente, incluindo todos os registros de viagem e reserva relacionados.
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={handleDeleteDriver}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default DriverManagement;
