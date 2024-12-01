import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CarReview.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Modal, Button } from "react-bootstrap";
import { API_URL } from "../App";

const CarReview = () => {
  const [carros, setCarros] = useState([]);
  const [filteredCarros, setFilteredCarros] = useState([]);
  const [filters, setFilters] = useState({ modelo: "", placa: "", quilometragem: "", nivelCombustivel: "" });
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [modalData, setModalData] = useState({
    novaQuilometragem: "",
    novoNivelCombustivel: "",
  });

  const isAnyFilterActive = Object.values(filters).some((value) => value);

  const fetchCarrosRevisao = () => {
    fetch(`${API_URL}/carros/aguardando`)
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao buscar carros para revisão.");
        return response.json();
      })
      .then((data) => {
        setCarros(data);
        setFilteredCarros(data);
      })
      .catch((error) => toast.error("Erro ao carregar dados: " + error.message));
  };

  useEffect(() => {
    fetchCarrosRevisao();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    // Aplicar filtros
    const filtered = carros.filter((carro) => {
      const matchesModelo = filters.modelo === "" || carro.modelo.toLowerCase().includes(filters.modelo.toLowerCase());
      const matchesPlaca = filters.placa === "" || carro.placa.toLowerCase().includes(filters.placa.toLowerCase());
      const matchesQuilometragem = filters.quilometragem === "" || carro.quilometragemAtual.toString().includes(filters.quilometragem);
      const matchesNivelCombustivel = filters.nivelCombustivel === "" || (carro.nivelCombustivelAtual === null ? "Nulo" : carro.nivelCombustivelAtual.toString().includes(filters.nivelCombustivel));

      return matchesModelo && matchesPlaca && matchesQuilometragem && matchesNivelCombustivel;
    });

    setFilteredCarros(filtered);
  };

  const clearFilters = () => {
    setFilters({ modelo: "", placa: "", quilometragem: "", nivelCombustivel: "" });
    setFilteredCarros(carros); // Restaura todos os carros
  };

  const openModal = (carro) => {
    setSelectedCar(carro);
    setModalData({
      novaQuilometragem: carro.quilometragemAtual || "",
      novoNivelCombustivel: carro.nivelCombustivelAtual || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCar(null);
    setModalData({ novaQuilometragem: "", novoNivelCombustivel: "" });
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalData({ ...modalData, [name]: value });
  };

  const handleRevisao = (carroId) => {
    const { novaQuilometragem, novoNivelCombustivel } = modalData;

    if (!novaQuilometragem || !novoNivelCombustivel) {
      toast.warning("Preencha todos os campos antes de continuar.");
      return;
    }

    fetch(
      `${API_URL}/carros/${carroId}/disponivel?novoNivelCombustivel=${novoNivelCombustivel}&novaQuilometragem=${novaQuilometragem}`,
      {
        method: "PUT",
      }
    )
      .then(async (response) => {
        if (!response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            const errorMessage = data.message || "Erro ao revisar o carro.";
            toast.error(errorMessage);
            throw new Error(errorMessage);
          } else {
            const text = await response.text();
            toast.error(text || "Erro ao revisar o carro.");
            throw new Error(text || "Erro ao revisar o carro.");
          }
        }

        toast.success("Carro atualizado com sucesso!");
        fetchCarrosRevisao();
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Erro na revisão:", error);
      });
  };

  return (
    <div className="carros-revisao">
      <Header />
      <main className="container my-5">
        <div className="card shadow">
          <div className="card-header bg-warning text-white">
            <h4>
              <i className="bi bi-wrench"></i> Carros Aguardando Revisão
            </h4>
          </div>
          <div className="card-body">
            {/* Filtros */}
            <div className="border p-3 mb-4">
              <div className="card-header bg-primary text-white">
                <h5><i className="bi bi-funnel"></i> Filtros</h5>
              </div>
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <label htmlFor="modelo" className="form-label">Modelo</label>
                  <input
                    type="text"
                    className="form-control"
                    id="modelo"
                    placeholder="Filtrar por Modelo"
                    name="modelo"
                    value={filters.modelo}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="placa" className="form-label">Placa</label>
                  <input
                    type="text"
                    className="form-control"
                    id="placa"
                    placeholder="Filtrar por Placa"
                    name="placa"
                    value={filters.placa}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="quilometragem" className="form-label">Quilometragem</label>
                  <input
                    type="number"
                    className="form-control"
                    id="quilometragem"
                    placeholder="Filtrar por Quilometragem"
                    name="quilometragem"
                    value={filters.quilometragem}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="nivelCombustivel" className="form-label">Nível de Combustível</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nivelCombustivel"
                    placeholder="Filtrar por Nível de Combustível"
                    name="nivelCombustivel"
                    value={filters.nivelCombustivel}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
              {isAnyFilterActive && (
                <button className="btn btn-secondary mb-3" onClick={clearFilters}>
                  Limpar Filtros
                </button>
              )}
            </div>

            {/* Tabela de Carros */}
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Modelo</th>
                  <th>Placa</th>
                  <th>Quilometragem Atual</th>
                  <th>Nível de Combustível Atual</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCarros.length > 0 ? (
                  filteredCarros.map((carro) => (
                    <tr key={carro.idCarro}>
                      <td>{carro.modelo}</td>
                      <td>{carro.placa}</td>
                      <td>{carro.quilometragemAtual}</td>
                      <td>{carro.nivelCombustivelAtual === null ? "Nulo" : carro.nivelCombustivelAtual}</td>
                      <td>
                        <span className="badge bg-warning text-dark">Aguardando Revisão</span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-primary" onClick={() => openModal(carro)}>
                          <i className="bi bi-tools"></i> Revisar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Nenhum carro aguardando revisão.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal para Revisão */}
        <Modal show={showModal} onHide={handleCloseModal} style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "black" }}><i className="bi bi-tools"></i> Revisão do Carro</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-dark" style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
            {selectedCar ? (
              <>
                <div className="mb-3">
                  <h5><i className="bi bi-car-front"></i> Carro</h5>
                  <p>
                    <strong>Modelo:</strong> {selectedCar.modelo} <br />
                    <strong>Placa:</strong> {selectedCar.placa}
                  </p>
                </div>
                <div className="mb-3">
                  <label htmlFor="novaQuilometragem" className="form-label">
                    Nova Quilometragem
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="novaQuilometragem"
                    name="novaQuilometragem"
                    value={modalData.novaQuilometragem}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="novoNivelCombustivel" className="form-label">
                    Nível de Combustível (L)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="novoNivelCombustivel"
                    name="novoNivelCombustivel"
                    value={modalData.novoNivelCombustivel || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            ) : (
              <p>Carregando dados do carro...</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => handleRevisao(selectedCar.idCarro)}
            >
              Fazer Revisão
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CarReview;