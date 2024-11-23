import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './Cadastro.css';

const Cadastro = () => {
  const handleCadastro = (e) => {
    e.preventDefault();
    alert('Cadastro realizado com sucesso!');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Cadastro</h1>
        <form onSubmit={handleCadastro}>
          <div className="form-group">
            <label htmlFor="username">Nome de Usuário</label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Digite o nome de usuário"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Digite seu e-mail"
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmação de Senha</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              placeholder="Confirme sua senha"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Cadastrar</button>
        </form>
        <Link to="/" className="registro">Já tem uma conta? Faça login</Link>
      </div>
    </div>
  );
};

export default Cadastro;
