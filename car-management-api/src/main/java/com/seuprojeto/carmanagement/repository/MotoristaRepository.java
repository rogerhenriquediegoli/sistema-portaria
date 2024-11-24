package com.seuprojeto.carmanagement.repository;

import com.seuprojeto.carmanagement.model.Motorista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MotoristaRepository extends JpaRepository<Motorista, Long> {
    // Não há métodos adicionais neste momento
}
