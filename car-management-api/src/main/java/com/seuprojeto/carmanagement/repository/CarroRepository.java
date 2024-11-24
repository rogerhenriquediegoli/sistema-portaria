package com.seuprojeto.carmanagement.repository;

import com.seuprojeto.carmanagement.model.Carro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarroRepository extends JpaRepository<Carro, String> {
    // Não há métodos adicionais neste momento
}
