import React, { useState } from "react";
import "./TripHistory.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TripHistory = () => {
  const [records, setRecords] = useState([
    {
      idRegistro: 1,
      motorista_cpf: "12345678900",
      carro_placa: "ABC1234",
      data_saida: "2024-11-20",
      data_entrada: "2024-11-21",
      quilometragem_saida: 1000,
      quilometragem_entrada: 1100,
      nivel_combustivel_saida: 80,
      nivel_combustivel_entrada: 50,
      abastecimentoExtra: 10,
    },
  ]);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.motorista_cpf.includes(search) || record.carro_placa.includes(search);

    const matchesDate =
      (!startDate || new Date(record.data_saida) >= new Date(startDate)) &&
      (!endDate || new Date(record.data_entrada) <= new Date(endDate));

    return matchesSearch && matchesDate;
  });

  return (
    <div className="travel-report">
      <Header />
      <main className="container my-5">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h4>
              <i className="bi bi-clipboard"></i> Relatório de Viagens
            </h4>
          </div>
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por CPF ou Placa"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Data Inicial"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Data Final"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-secondary w-100"
                  onClick={() => {
                    setSearch("");
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  <i className="bi bi-x-circle"></i> Limpar Filtros
                </button>
              </div>
            </div>

            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Motorista (CPF)</th>
                  <th>Carro (Placa)</th>
                  <th>Data Saída</th>
                  <th>Data Entrada</th>
                  <th>Quilometragem (Saída / Entrada)</th>
                  <th>Nível Combustível (Saída / Entrada)</th>
                  <th>Abastecimento Extra (L)</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.idRegistro}>
                    <td>{record.idRegistro}</td>
                    <td>{record.motorista_cpf}</td>
                    <td>{record.carro_placa}</td>
                    <td>{record.data_saida}</td>
                    <td>{record.data_entrada}</td>
                    <td>
                      {record.quilometragem_saida} km / {record.quilometragem_entrada} km
                    </td>
                    <td>
                      {record.nivel_combustivel_saida}% / {record.nivel_combustivel_entrada}%
                    </td>
                    <td>{record.abastecimentoExtra} L</td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
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
    </div>
  );
};

export default TripHistory;
