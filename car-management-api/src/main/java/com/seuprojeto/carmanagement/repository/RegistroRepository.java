package com.seuprojeto.carmanagement.repository;

import com.seuprojeto.carmanagement.model.Registro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegistroRepository extends JpaRepository<Registro, Long> {
    // Busca o último registro de viagem para o carro e motorista, ordenado pela data de saída (decrescente)
    Optional<Registro> findByCarroIdAndMotoristaIdAndQuilometragemEntradaIsNull(Long carroId, Long motoristaId);

}
