package com.seuprojeto.carmanagement.repository;

import com.seuprojeto.carmanagement.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Aqui você pode adicionar métodos personalizados se necessário
    // Exemplo: findByEmail

}
