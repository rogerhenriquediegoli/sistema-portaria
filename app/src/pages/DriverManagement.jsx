import React, { useState } from "react";
import "./DriverManagement.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([
    {
      cpf: "12345678900",
      nome: "João Silva",
      status: "Disponível",
      validade_cnh: "2025-12-31",
      telefone: "123456789",
    },
    {
      cpf: "09876543211",
      nome: "Maria Santos",
      status: "Em viagem",
      validade_cnh: "2024-05-20",
      telefone: "987654321",
    },
  ]);

  const [newDriver, setNewDriver] = useState({
    cpf: "",
    nome: "",
    status: "Disponível",
    validade_cnh: "",
    telefone: "",
  });

  const [editingDriver, setEditingDriver] = useState(null);
  const [search, setSearch] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "validade_cnh") {
      const today = new Date().toISOString().split("T")[0];
      if (value <= today) {
        alert("A validade da CNH deve ser uma data futura.");
        return;
      }
    }

    setNewDriver({ ...newDriver, [name]: value });
  };

  const handleAddDriver = () => {
    if (!newDriver.cpf || !newDriver.nome || !newDriver.validade_cnh) {
      alert("CPF, Nome e Validade da CNH são obrigatórios.");
      return;
    }

    const newDriverData = { ...newDriver };
    setDrivers([...drivers, newDriverData]);

    setNewDriver({
      cpf: "",
      nome: "",
      status: "Disponível",
      validade_cnh: "",
      telefone: "",
    });
  };

  const handleEditDriver = (driver) => {
    if (driver.status === "Em viagem") {
      alert("Não é possível editar motoristas com status 'Em viagem'.");
      return;
    }

    setEditingDriver(driver);
    setNewDriver(driver);
  };

  const handleSaveDriver = () => {
    if (!newDriver.nome || !newDriver.validade_cnh) {
      alert("Nome e Validade da CNH são obrigatórios.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (newDriver.validade_cnh <= today) {
      alert("A validade da CNH deve ser uma data futura.");
      return;
    }

    const updatedDrivers = drivers.map((driver) =>
      driver.cpf === editingDriver.cpf ? newDriver : driver
    );

    setDrivers(updatedDrivers);
    setEditingDriver(null);

    setNewDriver({
      cpf: "",
      nome: "",
      status: "Disponível",
      validade_cnh: "",
      telefone: "",
    });
  };

  const handleDeleteDriver = (cpf) => {
    const driverToDelete = drivers.find((driver) => driver.cpf === cpf);

    if (driverToDelete.status === "Em viagem") {
      alert("Não é possível excluir motoristas com status 'Em viagem'.");
      return;
    }

    const updatedDrivers = drivers.filter((driver) => driver.cpf !== cpf);
    setDrivers(updatedDrivers);
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
                <label htmlFor="telefone" className="form-label">Telefone</label>
                <input
                  type="text"
                  className="form-control"
                  id="telefone"
                  name="telefone"
                  value={newDriver.telefone}
                  onChange={handleInputChange}
                  placeholder="Ex.: 123456789"
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
                    onClick={handleSaveDriver}
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
                  <th>Telefone</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => (
                  <tr key={driver.cpf}>
                    <td>{driver.cpf}</td>
                    <td>{driver.nome}</td>
                    <td>{driver.status}</td>
                    <td>{driver.validade_cnh}</td>
                    <td>{driver.telefone}</td>
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
      <Footer />
    </div>
  );
};

export default DriverManagement;
