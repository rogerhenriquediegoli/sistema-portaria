package com.seuprojeto.carmanagement.service;

import com.seuprojeto.carmanagement.model.Usuario;
import com.seuprojeto.carmanagement.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Recupera todos os usuários
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    // Recupera um usuário pelo ID
    public Optional<Usuario> getUsuarioById(Long idUsuario) {
        return usuarioRepository.findById(idUsuario);
    }

    public Usuario cadastrarUsuario(Usuario usuario) {
        // Verificar se o nome de usuário está vazio
        if (usuario.getNomeUsuario() == null || usuario.getNomeUsuario().isEmpty()) {
            throw new IllegalArgumentException("O nome de usuário não pode estar vazio.");
        }

        // Verificar se o nome de usuário já está em uso
        if (usuarioRepository.existsByNomeUsuario(usuario.getNomeUsuario())) {
            throw new IllegalArgumentException("Nome de usuário já em uso. Por favor, escolha outro nome de usuário.");
        }

        // Verificar se o e-mail está vazio
        if (usuario.getEmail() == null || usuario.getEmail().isEmpty()) {
            throw new IllegalArgumentException("O e-mail não pode estar vazio.");
        }

        // Validar o formato do e-mail (verificando se contém '@')
        if (!usuario.getEmail().contains("@")) {
            throw new IllegalArgumentException("O e-mail fornecido não é válido. Certifique-se de que contém '@'.");
        }

        // Verificar se o e-mail já está em uso
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("Já existe um usuário com esse e-mail. Por favor, use outro e-mail.");
        }

        // Verificar se a senha está vazia
        if (usuario.getSenha() == null || usuario.getSenha().isEmpty()) {
            throw new IllegalArgumentException("A senha não pode estar vazia.");
        }

        // Salvar o novo usuário
        return usuarioRepository.save(usuario);
    }


    // Atualiza um usuário existente
    public Usuario updateUsuario(Long idUsuario, Usuario usuario) {
        if (usuarioRepository.existsById(idUsuario)) {
            usuario.setIdUsuario(idUsuario);
            return usuarioRepository.save(usuario);
        } else {
            return null;
        }
    }

    // Deleta um usuário pelo ID
    public void deleteUsuario(Long idUsuario) {
        usuarioRepository.deleteById(idUsuario);
    }

    // Realiza o login do usuário
    public Long login(String identificador, String senha) {
        // Verifica se o identificador é um e-mail ou nome de usuário
        Optional<Usuario> usuarioOpt;
        if (identificador.contains("@")) {
            usuarioOpt = usuarioRepository.findByEmail(identificador);
        } else {
            usuarioOpt = usuarioRepository.findByNomeUsuario(identificador);
        }

        // Se o usuário não existir
        if (usuarioOpt.isEmpty()) {
            throw new IllegalArgumentException("Usuário não encontrado. Verifique se o e-mail ou nome de usuário estão corretos.");
        }

        Usuario usuario = usuarioOpt.get();

        // Verifica se a senha está correta
        if (!usuario.getSenha().equals(senha)) {
            throw new IllegalArgumentException("Senha incorreta. Tente novamente.");
        }

        // Retorna o ID do usuário logado
        return usuario.getIdUsuario();
    }
}
