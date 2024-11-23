import React, { useState } from "react";
import "./CarManagement.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CarManagement = () => {
  const [cars, setCars] = useState([
    {
      placa: "ABC1234",
      modelo: "Fusca",
      status: "Aguardando Revisão",
      capacidadeTanque: 40,
      consumoMedio: 10,
      quilometragemAtual: 12000,
      nivelCombustivelAtual: 30,
    },
    {
      placa: "XYZ5678",
      modelo: "Civic",
      status: "Inativo",
      capacidadeTanque: 50,
      consumoMedio: 12,
      quilometragemAtual: 45000,
      nivelCombustivelAtual: null,
    },
  ]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar({ ...newCar, [name]: value });
  };

  const validateCarData = (car) => {
    const { capacidadeTanque, consumoMedio, quilometragemAtual } = car;
    return (
      capacidadeTanque > 0 &&
      consumoMedio > 0 &&
      quilometragemAtual >= 0
    );
  };

  const handleAddCar = () => {
    if (
      !newCar.placa ||
      !newCar.modelo ||
      !validateCarData({
        ...newCar,
        quilometragemAtual: newCar.quilometragemAtual || 0,
      })
    ) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    const newCarData = {
      ...newCar,
      nivelCombustivelAtual: null,
    };

    setCars([...cars, newCarData]);
    setNewCar({
      placa: "",
      modelo: "",
      status: "Aguardando Revisão",
      capacidadeTanque: "",
      consumoMedio: "",
      quilometragemAtual: "",
    });
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setNewCar(car);
  };

  const handleSaveCar = () => {
    // Verifica se o carro está em uso ou reservado
    if (editingCar.status === "Em uso" || editingCar.status === "Reservado") {
      alert("Não é possível editar carros com status 'Em uso' ou 'Reservado'.");
      return;
    }
  
    // Validações adicionais
    if (!validateCarData(newCar)) {
      alert("Preencha todos os campos corretamente.");
      return;
    }
  
    // Verifica se a capacidade do tanque é maior ou igual ao nível atual de combustível (se fornecido)
    if (
      newCar.nivelCombustivelAtual !== null &&
      parseFloat(newCar.capacidadeTanque) < parseFloat(newCar.nivelCombustivelAtual)
    ) {
      alert(
        "A capacidade do tanque não pode ser menor que o nível atual de combustível."
      );
      return;
    }
  
    // Verifica se a quilometragem atual aumentou
    if (
      parseFloat(newCar.quilometragemAtual) <
      parseFloat(editingCar.quilometragemAtual)
    ) {
      alert("A quilometragem atual não pode ser menor que a anterior.");
      return;
    }
  
    // Atualiza os dados do carro
    const updatedCars = cars.map((car) =>
      car.placa === editingCar.placa ? { ...newCar } : car
    );
  
    setCars(updatedCars);
    setEditingCar(null);
  
    // Limpa o formulário
    setNewCar({
      placa: "",
      modelo: "",
      status: "Aguardando Revisão",
      capacidadeTanque: "",
      consumoMedio: "",
      quilometragemAtual: "",
    });
  };
  

  const handleDeleteCar = (placa) => {
    // Verifica o status do carro antes de excluir
    const carToDelete = cars.find((car) => car.placa === placa);
  
    if (!carToDelete) {
      alert("Carro não encontrado.");
      return;
    }
  
    if (carToDelete.status === "Em uso" || carToDelete.status === "Reservado") {
      alert("Não é possível excluir carros com status 'Em uso' ou 'Reservado'.");
      return;
    }
  
    // Remove o carro da lista
    const updatedCars = cars.filter((car) => car.placa !== placa);
    setCars(updatedCars);
  };
  

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
                  placeholder="Ex.: ABC1234"
                  disabled={!!editingCar}
                />
              </div>
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
              <div className="col-md-12 text-end">
                {editingCar ? (
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={handleSaveCar}
                  >
                    <i className="bi bi-save"></i> Salvar Alterações
                  </button>
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
            <div className="row mb-4">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por placa ou modelo"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Todos os Status</option>
                  <option value="Disponível">Disponível</option>
                  <option value="Em uso">Em uso</option>
                  <option value="Aguardando Revisão">Aguardando Revisão</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>

            {/* Tabela de carros */}
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
                {filteredCars.map((car) => (
                  <tr key={car.placa}>
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
                      >
                        <i className="bi bi-pencil"></i> Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteCar(car.placa)}
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

export default CarManagement;
