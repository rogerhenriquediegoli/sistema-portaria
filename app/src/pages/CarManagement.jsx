// src/pages/CarManagement.js
import React, { useState } from "react";
import "./CarManagement.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CarManagement = () => {
  const [cars, setCars] = useState([
    { id: 1, placa: "ABC1234", modelo: "Fusca", status: "Disponível", quilometragem: 12000 },
    { id: 2, placa: "XYZ5678", modelo: "Civic", status: "Em uso", quilometragem: 45000 },
  ]);
  const [newCar, setNewCar] = useState({
    id: null,
    placa: "",
    modelo: "",
    status: "Disponível",
    quilometragem: "",
  });
  const [editingCar, setEditingCar] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar({ ...newCar, [name]: value });
  };

  const handleAddCar = () => {
    if (!newCar.placa || !newCar.modelo || !newCar.quilometragem) return;
    const newCarData = { ...newCar, id: cars.length + 1 };
    setCars([...cars, newCarData]);
    setNewCar({ id: null, placa: "", modelo: "", status: "Disponível", quilometragem: "" });
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setNewCar(car);
  };

  const handleSaveCar = () => {
    const updatedCars = cars.map((car) => (car.id === newCar.id ? newCar : car));
    setCars(updatedCars);
    setEditingCar(null);
    setNewCar({ id: null, placa: "", modelo: "", status: "Disponível", quilometragem: "" });
  };

  const handleDeleteCar = (id) => {
    const updatedCars = cars.filter((car) => car.id !== id);
    setCars(updatedCars);
  };

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
            <form className="row g-3 mb-4">
              <div className="col-md-3">
                <label htmlFor="placa" className="form-label">
                  Placa
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="placa"
                  name="placa"
                  value={newCar.placa}
                  onChange={handleInputChange}
                  placeholder="Ex.: ABC1234"
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="modelo" className="form-label">
                  Modelo
                </label>
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
                <label htmlFor="quilometragem" className="form-label">
                  Quilometragem
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="quilometragem"
                  name="quilometragem"
                  value={newCar.quilometragem}
                  onChange={handleInputChange}
                  placeholder="Ex.: 12000"
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
                  value={newCar.status}
                  onChange={handleInputChange}
                >
                  <option value="Disponível">Disponível</option>
                  <option value="Em uso">Em uso</option>
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
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Placa</th>
                  <th>Modelo</th>
                  <th>Status</th>
                  <th>Quilometragem</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car.id}>
                    <td>{car.id}</td>
                    <td>{car.placa}</td>
                    <td>{car.modelo}</td>
                    <td>{car.status}</td>
                    <td>{car.quilometragem} km</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditCar(car)}
                      >
                        <i className="bi bi-pencil"></i> Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteCar(car.id)}
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
