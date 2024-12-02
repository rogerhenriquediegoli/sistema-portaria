import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Importando react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Importando o estilo das notificações
import './Login.css';

// Importando a URL base da API
import { API_URL } from '../App';

const Login = () => {
  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false); // Estado para indicar o carregamento do login
  const navigate = useNavigate(); // Usando o useNavigate para navegação programática

  // Função para enviar os dados para a API (usando parâmetros na URL)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Inicia o carregamento

    try {
      // Formatar os parâmetros de consulta para a URL
      const queryParams = new URLSearchParams({
        identificador: identificador,
        senha: senha,
      }).toString();

      // Enviar os dados para a API de login com os parâmetros na URL
      const response = await fetch(`${API_URL}/usuarios/login?${queryParams}`, {
        method: 'POST', // Aqui usamos POST, mas com parâmetros na URL
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userId = await response.json(); // ID do usuário retornado pela API
        localStorage.setItem('userId', userId); // Armazena o ID do usuário no localStorage

        toast.success('Login realizado com sucesso!');

        // Verifica se já está redirecionando para evitar múltiplas chamadas
        if (!loading) {
          setLoading(true); // Inicia o carregamento
          // Delay de 2 segundos antes de redirecionar para o dashboard
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000); // Delay de 2 segundos antes de redirecionar para o dashboard
        }
      } else {
        const error = await response.text();
        toast.error(`Erro: ${error}`); // Exibe uma notificação de erro
      }
    } catch (error) {
      toast.error('Erro ao tentar realizar login. Tente novamente.');
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  // Verifica se o usuário está logado (existe o ID no localStorage)
  const checkLoginStatus = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      navigate('/dashboard'); // Se já estiver logado, vai direto para o dashboard
    }
  };

  // Verifica o login ao carregar a página
  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              name="identificador"  // Atributo name para preenchimento automático
              className="form-control"
              placeholder="Digite seu usuário"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              required
              autoComplete="username"  // Definindo o autocomplete como "username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="senha"  // Atributo name para preenchimento automático
              className="form-control"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="current-password"  // Definindo o autocomplete como "current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
        <Link to="/register" className="registro">Cadastre-se</Link>
      </div>

      {/* Contêiner de notificações */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop />
    </div>
  );
};

export default Login;
