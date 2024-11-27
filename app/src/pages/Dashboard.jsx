import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_URL } from '../App';
import { ToastContainer, toast} from 'react-toastify';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true); // Para controlar o estado de carregamento
  const [carsData, setCarsData] = useState({});
  const [showModal, setShowModal] = useState(false); // Estado para controlar a exibição do modal
  const [driversData, setDriversData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperando o userId do localStorage
    const userId = localStorage.getItem('userId');
    
    // Permitir a navegação (habilitar o botão de voltar) ao acessar o Dashboard
    window.onpopstate = function () {
      // Permite que o botão de voltar funcione normalmente
      window.history.go(0);
    };

      // Fazendo a requisição para obter o nome do usuário
      const fetchUserName = async () => {
        try {
          const response = await fetch(`${API_URL}/usuarios/${userId}`);
          if (response.ok) {
            const data = await response.json();
            setUserName(data.nomeUsuario);  // Assume que a API retorna o nome do usuário
          } else {
            console.error('Erro ao obter dados do usuário');
          }
        } catch (error) {
          console.error('Erro de rede', error);
        } finally {
          setLoading(false); // Fim do carregamento
        }
      };
      
      fetchUserName();
    
  }, [navigate]);

  useEffect(() => {
    // Função para buscar as estatísticas de carros por status
    const fetchCarStats = async () => {
      try {
        const response = await fetch(`${API_URL}/carros/count-status`);
        if (response.ok) {
          const data = await response.json();
          setCarsData(data); // Supondo que a resposta seja um JSON válido
        } else {
          console.error('Erro ao obter dados dos carros');
        }
      } catch (error) {
        console.error('Erro de rede', error);
      }
    };

    // Função para buscar as estatísticas de motoristas por status
    const fetchDriverStats = async () => {
      try {
        const response = await fetch(`${API_URL}/motoristas/count-status`);
        if (response.ok) {
          const data = await response.json();
          setDriversData(data); // Supondo que a resposta seja um JSON válido
        } else {
          console.error('Erro ao obter dados dos motoristas');
        }
      } catch (error) {
        console.error('Erro de rede', error);
      }
    };

    fetchCarStats();
    fetchDriverStats();
  }, []); // Executa a primeira vez quando o componente for montado

  const totalCars = carsData["Disponível"] + carsData["Em uso"] + carsData["Aguardando Revisão"] + carsData["Reservado"] + carsData["Inativo"];
  const totalDrivers = driversData["Disponível"] + driversData["Em Viagem"] + driversData["Inativos"];

// Função de logout
const handleLogout = () => {
  // Remove o ID do usuário do localStorage
  localStorage.removeItem('userId');

  // Exibe a notificação de sucesso de logout com um delay
  setShowModal(false)
  toast.success('Logout realizado com sucesso!');

  // Limpar o histórico do navegador para evitar voltar para a página anterior
  window.history.pushState(null, '', window.location.href);  // Limpa o estado atual do histórico
  window.onpopstate = function () {
    window.history.go(1);  // Impede o botão de voltar
  };
  
  // Redireciona para a página de login após um delay de 2 segundos
  setTimeout(() => {
    navigate('/', { replace: true }); // Usando `replace` para evitar que a página de dashboard fique no histórico
  }, 2000); // Delay de 2 segundos antes de redirecionar
};


  return (
    <div className="dashboard">
      <Header />
      <main className="container py-5">
        <br />
        <br />
        <h1 className="text-center mb-5">Dashboard</h1>
        {/* Exibe a mensagem de boas-vindas com o nome do usuário */}
        {loading ? (
          <h2 className="text-center mb-5 titulo-nome">Carregando...</h2>
        ) : (
          <div className="d-flex justify-content-between align-items-center">
          <h2 className="titulo-nome">Bem-vindo, {userName}!</h2>
            {/* Botão de Log Off */}
            <button className="btn btn-danger btn-logoff"  onClick={() => setShowModal(true)}>
              Log Off
            </button>
          </div>
        )}

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
                        width: `${(carsData["Disponível"] / totalCars) * 100}%`, // Corrigido para acessar a chave correta
                      }}
                    >
                      {carsData["Disponível"]}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <span>Em Uso:</span>
                  <div className="progress">
                    <div
                      className="progress-bar bg-warning"
                      style={{
                        width: `${(carsData["Em uso"] / totalCars) * 100}%`, // Corrigido para acessar a chave correta
                      }}
                    >
                      {carsData["Em uso"]}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <span>Aguardando Revisão:</span>
                  <div className="progress">
                    <div
                      className="progress-bar bg-warning"
                      style={{
                        width: `${(carsData["Aguardando Revisão"] / totalCars) * 100}%`, // Corrigido para acessar a chave correta
                      }}
                    >
                      {carsData["Aguardando Revisão"]}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <span>Reservados:</span>
                  <div className="progress">
                    <div
                      className="progress-bar bg-info"
                      style={{
                        width: `${(carsData["Reservado"] / totalCars) * 100}%`, // Corrigido para acessar a chave correta
                      }}
                    >
                      {carsData["Reservado"]}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <span>Inativos:</span>
                  <div className="progress">
                    <div
                      className="progress-bar bg-danger"
                      style={{
                        width: `${(carsData["Inativo"] / totalCars) * 100}%`, // Corrigido para acessar a chave correta
                      }}
                    >
                      {carsData["Inativo"]}
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
                        width: `${(driversData["Disponível"] / totalDrivers) * 100}%`, // Corrigido para acessar a chave correta
                      }}
                    >
                      {driversData["Disponível"]}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <span>Em Viagem:</span>
                  <div className="progress">
                    <div
                      className="progress-bar bg-warning"
                      style={{
                        width: `${(driversData["Em Viagem"] / totalDrivers) * 100}%`, // Corrigido para acessar a chave correta
                      }}
                    >
                      {driversData["Em Viagem"]}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <span>Inativos:</span>
                  <div className="progress">
                    <div
                      className="progress-bar bg-danger"
                      style={{
                        width: `${(driversData["Inativos"] / totalDrivers) * 100}%`, // Corrigido para acessar a chave correta
                      }}
                    >
                      {driversData["Inativos"]}
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
                <Link to="/cars-review" className="btn btn-outline-primary m-2">
                  Carros em Revisão
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Modal de Confirmação para Logoff */}
{showModal && (
  <div className="modal show" tabIndex="-1" style={{ display: 'block' }} aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" style={{ color: 'black' }}>Confirmar Logoff</h5>
          <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'black' }}>Tem certeza que deseja deslogar?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </button>
          <button type="button" className="btn btn-danger" onClick={handleLogout}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
)}
  {/* Contêiner de notificações */}
  <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop />
    </div>
  );
};

export default Dashboard;
