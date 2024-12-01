import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_URL } from "../App"; // Defina a URL da sua API

const TripHistory = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filters, setFilters] = useState({
    motoristaId: "",
    carroId: "",
    dataSaida: "",
    dataEntrada: "",
  });

  const fetchRecords = () => {
    fetch(`${API_URL}/registros`)
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao buscar registros.");
        return response.json();
      })
      .then((data) => {
        setRecords(data);
        setFilteredRecords(data);
      })
      .catch((error) => toast.error("Erro ao carregar dados: " + error.message));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    // Aplicar filtros
    const filtered = records.filter((record) => {
      const matchesMotoristaId = filters.motoristaId === "" || record.motoristaId.toString().includes(filters.motoristaId);
      const matchesCarroId = filters.carroId === "" || record.carroId.toString().includes(filters.carroId);
      const matchesDataSaida = filters.dataSaida === "" || record.dataSaida.includes(filters.dataSaida);
      const matchesDataEntrada = filters.dataEntrada === "" || record.dataEntrada.includes(filters.dataEntrada);

      return matchesMotoristaId && matchesCarroId && matchesDataSaida && matchesDataEntrada;
    });

    setFilteredRecords(filtered);
  };

  const clearFilters = () => {
    setFilters({
      motoristaId: "",
      carroId: "",
      dataSaida: "",
      dataEntrada: "",
    });
    setFilteredRecords(records); // Restaura todos os registros
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
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <label htmlFor="motoristaId" className="form-label">Motorista (ID)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="motoristaId"
                    placeholder="Filtrar por ID do Motorista"
                    name="motoristaId"
                    value={filters.motoristaId}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="carroId" className="form-label">Carro (ID)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="carroId"
                    placeholder="Filtrar por ID do Carro"
                    name="carroId"
                    value={filters.carroId}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-3">
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
                <div className="col-md-3">
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
                  <th>ID</th>
                  <th>Motorista (ID)</th>
                  <th>Carro (ID)</th>
                  <th>Data de Saída</th>
                  <th>Data de Entrada</th>
                  <th>Quilometragem (Saída / Entrada)</th>
                  <th>Nível de Combustível (Saída / Entrada)</th>
                  <th>Abastecimento Extra</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.idRegistro}>
                      <td>{record.idRegistro}</td>
                      <td>{record.motoristaId}</td>
                      <td>{record.carroId}</td>
                      <td>{new Date(record.dataSaida).toLocaleString()}</td>
                      <td>{new Date(record.dataEntrada).toLocaleString()}</td>
                      <td>
                        {record.quilometragemSaida} km / {record.quilometragemEntrada} km
                      </td>
                      <td>
                        {record.nivelCombustivelSaida}% / {record.nivelCombustivelEntrada}%
                      </td>
                      <td>{record.abastecimentoExtra} L</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
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
    </div>
  );
};

export default TripHistory;
