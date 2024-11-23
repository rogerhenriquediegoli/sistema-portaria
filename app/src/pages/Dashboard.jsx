// src/pages/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Dashboard = () => {
  const carsData = {
    disponiveis: 10,
    emUso: 5,
    aguardandoRevisao: 3,
    reservados: 2,
  };

  const driversData = {
    disponiveis: 12,
    emViagem: 4,
    inativos: 2,
  };

  const totalCars =
    carsData.disponiveis +
    carsData.emUso +
    carsData.aguardandoRevisao +
    carsData.reservados;

  const totalDrivers =
    driversData.disponiveis + driversData.emViagem + driversData.inativos;

  return (
    <div className="dashboard">
      <Header />
      <main className="container py-5">
        <br />
        <br />
        <h1 className="text-center mb-5">Dashboard</h1>
        <div className="row g-4">
          {/* Seção de Carros */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h4>
                  <i className="bi bi-car-front-fill"></i> Carros
                </h4>
              </div>
              <div className="card-body">
                <p>
                  <strong>Total de Carros:</strong> {totalCars}
                </p>
                <div className="mb-3">
                  <span>Disponíveis:</span>
                  <div className="progress">
                    <div
                      className="progress-bar bg-success"
                      style={{
                        width: `${(carsData.disponiveis / totalCars) * 100}%`,
                      }}
                    >
                      {carsData.disponiveis}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <span>Em Uso:</span>
                  <div className="progress">
                    <div
                      className="progress-bar bg-warning"
                      style={{
                        width: `${(carsData.emUso / totalCars) * 100}%`,
                      }}
                    >
                      {carsData.emUso}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <span>Aguardando Revisão:</span>
                  <div className="progress">
                    <div
                      className="progress-bar bg-danger"
                      style={{
                        width: `${
                          (carsData.aguardandoRevisao / totalCars) * 100
                        }%`,
                      }}
                    >
                      {carsData.aguardandoRevisao}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <span>Reservados:</span>
                  <div className="progress">
                    <div
                      className="progress-bar bg-info"
                      style={{
                        width: `${(carsData.reservados / totalCars) * 100}%`,
                      }}
                    >
                      {carsData.reservados}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Motoristas */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-info text-white">
                <h4>
                  <i className="bi bi-person-fill"></i> Motoristas
                </h4>
              </div>
              <div className="card-body">
                <p>
                  <strong>Total de Motoristas:</strong> {totalDrivers}
                </p>
                <div className="mb-3">
                  <span>Disponíveis:</span>
                  <div className="progress">
                    <div
                      className="progress-bar bg-success"
                      style={{
                        width: `${
                          (driversData.disponiveis / totalDrivers) * 100
                        }%`,
                      }}
                    >
                      {driversData.disponiveis}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <span>Em Viagem:</span>
                  <div className="progress">
                    <div
                      className="progress-bar bg-warning"
                      style={{
                        width: `${
                          (driversData.emViagem / totalDrivers) * 100
                        }%`,
                      }}
                    >
                      {driversData.emViagem}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <span>Inativos:</span>
                  <div className="progress">
                    <div
                      className="progress-bar bg-danger"
                      style={{
                        width: `${(driversData.inativos / totalDrivers) * 100}%`,
                      }}
                    >
                      {driversData.inativos}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-secondary text-white">
                <h4>
                  <i className="bi bi-link-45deg"></i> Links Rápidos
                </h4>
              </div>
              <div className="card-body d-flex flex-wrap justify-content-around">
                <Link to="/manage-car" className="btn btn-outline-primary m-2">
                  Gerenciar Carros
                </Link>
                <Link
                  to="/manage-drivers"
                  className="btn btn-outline-primary m-2"
                >
                  Gerenciar Motoristas
                </Link>
                <Link to="/reserve-car" className="btn btn-outline-primary m-2">
                  Reservar Carro
                </Link>
                <Link
                  to="/register-trip"
                  className="btn btn-outline-primary m-2"
                >
                  Registrar Viagem
                </Link>
                <Link
                  to="/trip-history"
                  className="btn btn-outline-primary m-2"
                >
                  Relatório de Viagens
                </Link>
                <Link to="/manage-cars" className="btn btn-outline-primary m-2">
                  Carros em Revisão
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
