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
    status: "Disponível",
    validade_cnh: "",
  });

  const [editingDriver, setEditingDriver] = useState(null);
  const [search, setSearch] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(null); // 'add', 'edit', 'delete'
  const [driverToDelete, setDriverToDelete] = useState(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch(`${API_URL}/motoristas`);
        if (response.ok) {
          const data = await response.json();
          setDrivers(data);
        } else {
          console.error("Erro ao carregar motoristas.");
        }
      } catch (error) {
        console.error("Erro de rede", error);
      }
    };
    fetchDrivers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "validade_cnh") {
      const today = new Date().toISOString().split("T")[0];
      if (value <= today) {
        toast.error("A validade da CNH deve ser uma data futura.");
        return;
      }
    }

    setNewDriver({ ...newDriver, [name]: value });
  };

  const handleAddDriver = () => {
    setActionType('add');
    setShowConfirmModal(true);
  };

  const handleEditDriver = (driver) => {
    if (driver.status === "Em viagem") {
      toast.error("Não é possível editar motoristas com status 'Em viagem'.");
      return;
    }

    setActionType('edit');
    setEditingDriver(driver);
    setNewDriver(driver);
    setShowConfirmModal(true);
  };

  const handleDeleteDriver = (cpf) => {
    const driver = drivers.find((d) => d.cpf === cpf);
    if (driver.status === "Em viagem") {
      toast.error("Não é possível excluir motoristas com status 'Em viagem'.");
      return;
    }

    setActionType('delete');
    setDriverToDelete(driver);
    setShowConfirmModal(true);
  };

  const handleSaveDriver = async () => {
    if (!newDriver.validade_cnh) {
      toast.error("Validade da CNH é obrigatória.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (newDriver.validade_cnh <= today) {
      toast.error("A validade da CNH deve ser uma data futura.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/motoristas/${editingDriver.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newDriver.status,
          validadeCnh: newDriver.validade_cnh,
        }),
      });

      if (response.ok) {
        const updatedDriver = await response.json();
        setDrivers(
          drivers.map((driver) =>
            driver.cpf === updatedDriver.cpf ? updatedDriver : driver
          )
        );
        setEditingDriver(null);
        setNewDriver({
          cpf: "",
          nome: "",
          status: "Disponível",
          validade_cnh: "",
        });
        toast.success("Motorista atualizado com sucesso!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erro ao atualizar motorista.");
      }
    } catch (error) {
      console.error("Erro ao salvar motorista", error);
      toast.error("Erro ao salvar motorista.");
    }

    setShowConfirmModal(false);
  };

  const handleAddDriverConfirmed = async () => {
    if (!newDriver.validade_cnh) {
      toast.error("Validade da CNH é obrigatória.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (newDriver.validade_cnh <= today) {
      toast.error("A validade da CNH deve ser uma data futura.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/motoristas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf: newDriver.cpf,
          nome: newDriver.nome,
          status: newDriver.status,
          validadeCnh: newDriver.validade_cnh,
        }),
      });

      if (response.ok) {
        const addedDriver = await response.json();
        setDrivers([...drivers, addedDriver]);
        setNewDriver({
          cpf: "",
          nome: "",
          status: "Disponível",
          validade_cnh: "",
        });
        toast.success("Motorista adicionado com sucesso!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erro ao adicionar motorista.");
      }
    } catch (error) {
      console.error("Erro ao adicionar motorista", error);
      toast.error("Erro ao adicionar motorista.");
    }

    setShowConfirmModal(false);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const response = await fetch(`${API_URL}/motoristas/${driverToDelete.cpf}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDrivers(drivers.filter((driver) => driver.cpf !== driverToDelete.cpf));
        toast.success("Motorista excluído com sucesso!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erro ao excluir motorista.");
      }
    } catch (error) {
      console.error("Erro ao excluir motorista", error);
      toast.error("Erro ao excluir motorista.");
    }

    setShowConfirmModal(false);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("pt-BR"); // Exibe no formato DD/MM/YYYY
  };

  const filteredDrivers = drivers.filter((driver) =>
    driver.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="driver-management">
      <Header />
      <main className="container my-5">
        <div className="card shadow">
          <div className="card-header bg-success text-white">
            <h4>
              <i className="bi bi-person"></i> Gerenciamento de Motoristas
            </h4>
          </div>
          <div className="card-body">
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
                  placeholder="Ex.: 12345678900"
                  disabled={!!editingDriver}
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
                <label htmlFor="validade_cnh" className="form-label">Validade CNH</label>
                <input
                  type="date"
                  className="form-control"
                  id="validade_cnh"
                  name="validade_cnh"
                  value={newDriver.validade_cnh}
                  onChange={handleInputChange}
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
                  <option value="Disponível">Disponível</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
              <div className="col-md-12 text-end">
                {editingDriver ? (
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={handleEditDriver}
                    disabled={newDriver.status === "Em viagem"}
                  >
                    <i className="bi bi-save"></i> Salvar Alterações
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleAddDriver}
                  >
                    <i className="bi bi-plus-circle"></i> Adicionar Motorista
                  </button>
                )}
              </div>
            </form>

            <div className="row mb-4">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nome"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

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
                {filteredDrivers.map((driver) => (
                  <tr key={driver.cpf}>
                    <td>{driver.cpf}</td>
                    <td>{driver.nome}</td>
                    <td>{driver.status}</td>
                    <td>{formatDate(driver.validade_cnh)}</td> {/* Formatação da data */}
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditDriver(driver)}
                        disabled={driver.status === "Em viagem"}
                      >
                        <i className="bi bi-pencil"></i> Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteDriver(driver.cpf)}
                        disabled={driver.status === "Em viagem"}
                      >
                        <i className="bi bi-trash"></i> Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal de Confirmação */}
      {showConfirmModal && (
        <div className="modal">
          <div className="modal-content">
            <h5>{actionType === 'delete' ? "Excluir Motorista" : actionType === 'edit' ? "Salvar Alterações" : "Adicionar Motorista"}</h5>
            <p>
              {actionType === 'delete' ? "Você tem certeza que deseja excluir este motorista?" : "Deseja continuar com a operação?"}
            </p>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancelar</button>
              <button
                className="btn btn-danger"
                onClick={
                  actionType === 'delete' ? handleDeleteConfirmed : actionType === 'edit' ? handleSaveDriver : handleAddDriverConfirmed
                }
              >
                {actionType === 'delete' ? "Excluir" : actionType === 'edit' ? "Salvar" : "Adicionar"}
              </button>
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
