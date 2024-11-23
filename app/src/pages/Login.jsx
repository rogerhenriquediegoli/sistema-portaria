import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom'; // Importando o useNavigate
import './Login.css';

const Login = () => {
  const navigate = useNavigate(); // Usando o useNavigate para navegação programática

  const handleLogin = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica de validação do login, se necessário.
    alert('Login realizado com sucesso!');
    
    // Após o login bem-sucedido, redireciona para o Dashboard
    navigate('/dashboard'); // Redireciona para a rota '/dashboard'
  };

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
              className="form-control"
              placeholder="Digite seu usuário"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Digite sua senha"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Entrar</button>
        </form>
        <Link to="/register" className="registro">Cadastre-se</Link>
      </div>
    </div>
  );
};

export default Login;
