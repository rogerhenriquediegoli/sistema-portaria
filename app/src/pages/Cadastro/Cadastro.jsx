import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import './Cadastro.css';
import { API_URL } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cadastro = () => {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Função para enviar os dados do formulário para a API
  const handleCadastro = async (e) => {
    e.preventDefault();
    
    // Validação de senha
    if (senha !== confirmPassword) {
      toast.error('As senhas não coincidem!'); 
      return;
    }

    // Dados do usuário
    const usuario = {
      nomeUsuario,
      email,
      senha,
    };

    setLoading(true);

    try {
      // Enviar requisição POST para o backend
      const response = await fetch(`${API_URL}/usuarios/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });

      // Verifica a resposta da API
      if (response.ok) {
        const data = await response.json();
        toast.success('Cadastro realizado com sucesso!');
        setTimeout(() => {
          navigate('/');
        }, 2000); // Delay de 2 segundos antes de redirecionar
        
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Erro ao cadastrar. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      toast.error('Erro ao cadastrar. Tente novamente mais tarde.'); 
    } finally {
      setLoading(false);
    }
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
              value={nomeUsuario}
              onChange={(e) => setNomeUsuario(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Carregando...' : 'Cadastrar'} 
          </button>
        </form>
        <Link to="/" className="registro">Já tem uma conta? Faça login</Link>
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop />
    </div>
  );
};

export default Cadastro;
