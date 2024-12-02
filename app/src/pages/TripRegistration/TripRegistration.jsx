import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./TripRegistration.css";

const TripRegistration = () => {
  return (
    <div className="register-trip">
      <Header />
      <main className="container my-5">
        <div className="card-registration card shadow">
          <div className="card-header bg-primary text-white">
            <h4>
              <i className="bi bi-arrow-left-right"></i> Registrar Viagem
            </h4>
          </div>
          <div className="card-body text-center">
            <p>Escolha uma ação:</p>
            <div className="d-flex justify-content-center">
              <Link to="/register-trip-exit" className="btn btn-success mx-2">
                Registrar Saída
              </Link>
              <Link to="/register-trip-entry" className="btn btn-warning mx-2">
                Registrar Entrada
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TripRegistration;
