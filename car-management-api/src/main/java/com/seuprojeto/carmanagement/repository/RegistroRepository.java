package com.seuprojeto.carmanagement.repository;

import com.seuprojeto.carmanagement.model.Registro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroRepository extends JpaRepository<Registro, Long> {
    // Não há métodos adicionais neste momento
}
