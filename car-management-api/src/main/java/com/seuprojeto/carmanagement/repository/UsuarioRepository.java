package com.seuprojeto.carmanagement.repository;

import com.seuprojeto.carmanagement.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Buscar usuário por email
    Optional<Usuario> findByEmail(String email);

    // Buscar usuário por nome de usuário
    Optional<Usuario> findByNomeUsuario(String nomeUsuario);

    // Buscar por email ou nome de usuário
    Optional<Usuario> findByEmailOrNomeUsuario(String email, String nomeUsuario);

    // Verificar se já existe um usuário com o email fornecido
    boolean existsByEmail(String email);

    // Verificar se já existe um usuário com o nome de usuário fornecido
    boolean existsByNomeUsuario(String nomeUsuario);
}
