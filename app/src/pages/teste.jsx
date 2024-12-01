import React, { useState, useEffect } from "react"; // Importação dos hooks
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CarReview.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_URL } from "../App";

// Restante do código...


const CarReview = () => {
    const [carros, setCarros] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [modalData, setModalData] = useState({
      novaQuilometragem: "",
      novoNivelCombustivel: "",
    });
  
    const fetchCarrosRevisao = () => {
      fetch(${API_URL}/carros/aguardando)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro ao buscar carros para revisão.");
          }
          return response.json();
        })
        .then((data) => setCarros(data))
        .catch((error) => toast.error("Erro ao carregar dados: " + error.message));
    };
  
    useEffect(() => {
      fetchCarrosRevisao();
    }, []);
  
    const openModal = (carro) => {
      setSelectedCar(carro);
      setModalData({
        novaQuilometragem: carro.quilometragemAtual || "",
        novoNivelCombustivel: carro.nivelCombustivelAtual || "", // Aqui deixamos vazio no campo de edição
      });
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
    
      fetch(${API_URL}/carros/${carroId}/disponivel?novoNivelCombustivel=${novoNivelCombustivel}&novaQuilometragem=${novaQuilometragem}, {
        method: "PUT",
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              toast.error(text); // Mostra o erro retornado pela API
              throw new Error(text); // Lança erro para evitar o processamento posterior
            });
          }
          return response.text(); // Caso a resposta seja ok, extraímos o texto da resposta
        })
        .then(() => {
          toast.success("Carro atualizado com sucesso!");
          fetchCarrosRevisao(); // Atualiza a lista de carros após revisão
          setSelectedCar(null); // Fecha o modal
          setModalData({ novaQuilometragem: "", novoNivelCombustivel: "" }); // Limpa os campos
        })
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
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Modelo</th>
                    <th>Placa</th>
                    <th>Quilometragem Atual</th>
                    <th>Nível de Combustível Atual</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {carros.length > 0 ? (
                    carros.map((carro) => (
                      <tr key={carro.idCarro}>
                        <td>{carro.idCarro}</td>
                        <td>{carro.modelo}</td>
                        <td>{carro.placa}</td>
                        <td>{carro.quilometragemAtual}</td>
                        <td>{carro.nivelCombustivelAtual === null ? "Nulo" : carro.nivelCombustivelAtual}</td>
                        <td>
                          <span className="badge bg-warning text-dark">
                            Aguardando Revisão
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => openModal(carro)}
                          >
                            <i className="bi bi-tools"></i> Revisar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Nenhum carro aguardando revisão.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
  
          {/* Modal para revisão */}
          {selectedCar && (
            <div className="modal show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Revisão do Carro</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setSelectedCar(null)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>
                      <strong>ID:</strong> {selectedCar.idCarro}
                    </p>
                    <p>
                      <strong>Modelo:</strong> {selectedCar.modelo}
                    </p>
                    <p>
                      <strong>Placa:</strong> {selectedCar.placa}
                    </p>
                    <p>
                      <strong>Quilometragem Atual:</strong> {selectedCar.quilometragemAtual}
                    </p>
                    <p>
                      <strong>Nível de Combustível Atual:</strong> {selectedCar.nivelCombustivelAtual === null ? "Nulo" : selectedCar.nivelCombustivelAtual}
                    </p>
                    <p>
                      <strong>Status:</strong> Disponível (após revisão)
                    </p>
  
                    <div className="mb-3" style={{ color: "black" }}>
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
                        style={{ color: "black" }}
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
                        style={{ color: "black" }}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setSelectedCar(null)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleRevisao(selectedCar.idCarro)}
                    >
                      Fazer Revisão
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  };
  
  export default CarReview;