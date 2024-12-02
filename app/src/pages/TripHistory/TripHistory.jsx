import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { API_URL } from '../../App'; // Defina a URL da sua API
import "./TripHistory.css";
const TripHistory = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filters, setFilters] = useState({
    motorista: "",
    carro: "",
    quilometragemSaida: "",
    quilometragemEntrada: "",
    nivelCombustivelSaida: "",
    nivelCombustivelEntrada: "",
    dataSaida: "",
    dataEntrada: "",
    status: "",
    abastecimentoExtra: false,
  });
  const [recordToDelete, setRecordToDelete] = useState(null); // Estado para o registro a ser excluído
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Controle do modal de exclusão
  const [loading, setLoading] = useState(true); // Estado para controle de carregamento

  const fetchRecords = async () => {
    setLoading(true); // Iniciar o carregamento
    try {
      const response = await fetch(`${API_URL}/registros`);
      if (!response.ok) throw new Error("Erro ao buscar registros.");
      const data = await response.json();

      const recordsWithDetails = await Promise.all(
        data.map(async (record) => {
          const motoristaResponse = await fetch(`${API_URL}/motoristas/${record.motoristaId}`);
          const carroResponse = await fetch(`${API_URL}/carros/${record.carroId}`);
          const motoristaData = await motoristaResponse.json();
          const carroData = await carroResponse.json();

          return {
            ...record,
            motoristaNome: motoristaData.nome,
            motoristaCpf: motoristaData.cpf,
            carroModelo: carroData.modelo,
            carroPlaca: carroData.placa,
          };
        })
      );

      setRecords(recordsWithDetails);
      setFilteredRecords(recordsWithDetails);
    } catch (error) {
      toast.error("Erro ao carregar dados: " + error.message);
    } finally {
      setLoading(false); // Finalizar o carregamento
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    const updatedFilters = { ...filters, [name]: type === "checkbox" ? checked : value };
    const filtered = records.filter((record) => {
      const matchesMotorista =
        !updatedFilters.motorista ||
        (record.motoristaNome && record.motoristaNome.toLowerCase().includes(updatedFilters.motorista.toLowerCase())) ||
        (record.motoristaCpf && record.motoristaCpf.toString().includes(updatedFilters.motorista));
      const matchesCarro =
        !updatedFilters.carro ||
        (record.carroModelo && record.carroModelo.toLowerCase().includes(updatedFilters.carro.toLowerCase())) ||
        (record.carroPlaca && record.carroPlaca.includes(updatedFilters.carro));
      const matchesQuilometragemSaida =
        !updatedFilters.quilometragemSaida ||
        (record.quilometragemSaida !== null &&
          record.quilometragemSaida.toString().includes(updatedFilters.quilometragemSaida));
      const matchesQuilometragemEntrada =
        !updatedFilters.quilometragemEntrada ||
        (record.quilometragemEntrada !== null &&
          record.quilometragemEntrada.toString().includes(updatedFilters.quilometragemEntrada));
      const matchesNivelCombustivelSaida =
        !updatedFilters.nivelCombustivelSaida ||
        (record.nivelCombustivelSaida !== null &&
          record.nivelCombustivelSaida.toString().includes(updatedFilters.nivelCombustivelSaida));
      const matchesNivelCombustivelEntrada =
        !updatedFilters.nivelCombustivelEntrada ||
        (record.nivelCombustivelEntrada !== null &&
          record.nivelCombustivelEntrada.toString().includes(updatedFilters.nivelCombustivelEntrada));
      const matchesDataSaida =
        !updatedFilters.dataSaida ||
        (record.dataSaida && new Date(record.dataSaida).toLocaleDateString() === new Date(updatedFilters.dataSaida).toLocaleDateString());
      const matchesDataEntrada =
        !updatedFilters.dataEntrada ||
        (record.dataEntrada && new Date(record.dataEntrada).toLocaleDateString() === new Date(updatedFilters.dataEntrada).toLocaleDateString());
      const matchesStatus = !updatedFilters.status || getStatus(record) === updatedFilters.status;
      const matchesAbastecimentoExtra = !updatedFilters.abastecimentoExtra || (record.abastecimentoExtra > 0);

      return (
        matchesMotorista &&
        matchesCarro &&
        matchesQuilometragemSaida &&
        matchesQuilometragemEntrada &&
        matchesNivelCombustivelSaida &&
        matchesNivelCombustivelEntrada &&
        matchesDataSaida &&
        matchesDataEntrada &&
        matchesStatus &&
        matchesAbastecimentoExtra
      );
    });

    setFilteredRecords(filtered);
  };

  const clearFilters = () => {
    setFilters({
      motorista: "",
      carro: "",
      quilometragemSaida: "",
      quilometragemEntrada: "",
      nivelCombustivelSaida: "",
      nivelCombustivelEntrada: "",
      dataSaida: "",
      dataEntrada: "",
      status: "",
      abastecimentoExtra: false,
    });
    setFilteredRecords(records);
  };

  const getStatus = (record) => {
    return Object.values(record).some((value) => value === null) ? "Em andamento" : "Finalizada";
  };

  // Função para confirmar a exclusão do registro
  const confirmDeleteRecord = (record) => {
    setRecordToDelete(record); // Definir o registro a ser excluído
    setShowDeleteModal(true); // Exibir o modal de confirmação de exclusão
  };

  // Função para excluir o registro
  const handleDeleteRecord = async () => {
    if (!recordToDelete) return;

    try {
      const response = await fetch(`${API_URL}/registros/${recordToDelete.idRegistro}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setFilteredRecords(filteredRecords.filter((record) => record.idRegistro !== recordToDelete.idRegistro));
        toast.success("Registro excluído com sucesso!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erro ao excluir registro.");
      }
    } catch (error) {
      console.error("Erro ao excluir registro", error);
      toast.error("Erro ao excluir registro.");
    }

    setShowDeleteModal(false); // Fechar o modal de exclusão
  };

  return (
    <div className="trip-history">
      <Header />
      <main className="container my-5">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h4>
              <i className="bi bi-clipboard"></i> Histórico de Viagens
            </h4>
          </div>
          <div className="card-body">
            {/* Filtros */}
            <div className="border p-3 mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0"><i className="bi bi-funnel"></i> Filtros</h5>
              </div>
              <br />
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label htmlFor="motorista" className="form-label">Motorista (Nome ou CPF)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="motorista"
                    placeholder="Filtrar por Nome ou CPF do Motorista"
                    name="motorista"
                    value={filters.motorista}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="carro" className="form-label">Carro (Modelo ou Placa)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="carro"
                    placeholder="Filtrar por Modelo ou Placa do Carro"
                    name="carro"
                    value={filters.carro}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="quilometragemSaida" className="form-label">Quilometragem (Saída)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="quilometragemSaida"
                    placeholder="Filtrar por Quilometragem de Saída"
                    name="quilometragemSaida"
                    value={filters.quilometragemSaida}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="quilometragemEntrada" className="form-label">Quilometragem (Entrada)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="quilometragemEntrada"
                    placeholder="Filtrar por Quilometragem de Entrada"
                    name="quilometragemEntrada"
                    value={filters.quilometragemEntrada}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="nivelCombustivelSaida" className="form-label">Nível de Combustível (Saída)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nivelCombustivelSaida"
                    placeholder="Filtrar por Nível de Combustível de Saída"
                    name="nivelCombustivelSaida"
                    value={filters.nivelCombustivelSaida}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="nivelCombustivelEntrada" className="form-label">Nível de Combustível (Entrada)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nivelCombustivelEntrada"
                    placeholder="Filtrar por Nível de Combustível de Entrada"
                    name="nivelCombustivelEntrada"
                    value={filters.nivelCombustivelEntrada}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="dataSaida" className="form-label">Data de Saída</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dataSaida"
                    name="dataSaida"
                    value={filters.dataSaida}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="dataEntrada" className="form-label">Data de Entrada</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dataEntrada"
                    name="dataEntrada"
                    value={filters.dataEntrada}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-4">
                  <div className="card p-3">
                    <h5 className="card-title">Filtro de Abastecimento Extra</h5>
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="abastecimentoExtra"
                        name="abastecimentoExtra"
                        checked={filters.abastecimentoExtra}
                        onChange={handleFilterChange}
                      />
                      <label className="form-check-label" htmlFor="abastecimentoExtra">
                        {filters.abastecimentoExtra ? "Com Abastecimento Extra" : "Sem Abastecimento Extra"}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <label htmlFor="status" className="form-label">Status da Viagem</label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">Todos</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Finalizada">Finalizada</option>
                  </select>
                </div>
              </div>
              {Object.values(filters).some((value) => value) && (
                <button className="btn btn-secondary mb-3" onClick={clearFilters}>
                  Limpar Filtros
                </button>
              )}
            </div>

            {/* Tabela de Registros */}
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Motorista</th>
                  <th>Carro</th>
                  <th>Data de Saída</th>
                  <th>Data de Entrada</th>
                  <th>Quilometragem (Saída)</th>
                  <th>Quilometragem (Entrada)</th>
                  <th>Nível de Combustível (Saída)</th>
                  <th>Nível de Combustível (Entrada)</th>
                  <th>Abastecimento Extra</th>
                  <th>Status da Viagem</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {loading ? ( // Verifica se está carregando
                  <tr>
                    <td colSpan="10" className="text-center">
                      Carregando...
                    </td>
                  </tr>
                ) : filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.idRegistro}>
                      <td>{record.motoristaNome} - {record.motoristaCpf}</td>
                      <td>{record.carroModelo} - {record.carroPlaca}</td>
                      <td>
                        {record.dataSaida ? (
                          new Date(record.dataSaida).toLocaleString()
                        ) : (
                          <span className="badge bg-secondary text-white">Nulo</span>
                        )}
                      </td>
                      <td>
                        {record.dataEntrada ? (
                          new Date(record.dataEntrada).toLocaleString()
                        ) : (
                          <span className="badge bg-secondary text-white">Nulo</span>
                        )}
                      </td>
                      <td>
                        {record.quilometragemSaida !== null ? (
                          `${record.quilometragemSaida} km`
                        ) : (
                          <span className="badge bg-secondary text-white">Nulo</span>
                        )}
                      </td>
                      <td>
                        {record.quilometragemEntrada !== null ? (
                          `${record.quilometragemEntrada} km`
                        ) : (
                          <span className="badge bg-secondary text-white">Nulo</span>
                        )}
                      </td>
                      <td>
                        {record.nivelCombustivelSaida !== null ? (
                          `${record.nivelCombustivelSaida} L`
                        ) : (
                          <span className="badge bg-secondary text-white">Nulo</span>
                        )}
                      </td>
                      <td>
                        {record.nivelCombustivelEntrada !== null ? (
                          `${record.nivelCombustivelEntrada} L`
                        ) : (
                          <span className="badge bg-secondary text-white">Nulo</span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            record.abastecimentoExtra === null
                              ? "bg-secondary text-white"
                              : record.abastecimentoExtra > 0
                              ? "bg-light text-dark"
                              : "bg-danger text-white"
                          }`}
                        >
                          {record.abastecimentoExtra === null
                            ? "Nulo"
                            : record.abastecimentoExtra > 0
                            ? `${record.abastecimentoExtra.toFixed(3)} L`
                            : "Não"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            getStatus(record) === "Em andamento" ? "bg-warning" : "bg-success"
                          }`}
                        >
                          {getStatus(record)}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => confirmDeleteRecord(record)}
                          disabled={getStatus(record) === "Em andamento"} // Desabilita se o status for "Em andamento"
                        >
                          <i className="bi bi-trash"></i> Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Modal de confirmação de exclusão */}
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
                {recordToDelete && (
                  <>
                    <p><strong>Motorista:</strong> {recordToDelete.motoristaNome} - {recordToDelete.motoristaCpf}</p>
                    <p><strong>Carro:</strong> {recordToDelete.carroModelo} - {recordToDelete.carroPlaca}</p>
                    <p><strong>Data de Saída:</strong> {recordToDelete.dataSaida ? new Date(recordToDelete.dataSaida).toLocaleString() : "Nulo"}</p>
                    <p><strong>Data de Entrada:</strong> {recordToDelete.dataEntrada ? new Date(recordToDelete.dataEntrada).toLocaleString() : "Nulo"}</p>
                    <p><strong>Quilometragem (Saída):</strong> {recordToDelete.quilometragemSaida !== null ? `${recordToDelete.quilometragemSaida} km` : "Nulo"}</p>
                    <p><strong>Quilometragem (Entrada):</strong> {recordToDelete.quilometragemEntrada !== null ? `${recordToDelete.quilometragemEntrada} km` : "Nulo"}</p>
                    <p><strong>Nível de Combustível (Saída):</strong> {recordToDelete.nivelCombustivelSaida !== null ? `${recordToDelete.nivelCombustivelSaida} L` : "Nulo"}</p>
                    <p><strong>Nível de Combustível (Entrada):</strong> {recordToDelete.nivelCombustivelEntrada !== null ? `${recordToDelete.nivelCombustivelEntrada} L` : "Nulo"}</p>
                    <div className="alert alert-warning" role="alert">
                      <strong>Atenção:</strong> Ao confirmar, o registro de viagem será removido permanentemente.
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={handleDeleteRecord}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripHistory;
