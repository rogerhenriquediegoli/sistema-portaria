package com.seuprojeto.carmanagement.repository;

import com.seuprojeto.carmanagement.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    // Método derivado para buscar reserva ativa vinculando carro e motorista
    Optional<Reserva> findByCarroIdAndMotoristaIdAndStatus(Long carroId, Long motoristaId, String status);

    boolean existsByMotoristaIdAndStatus(Long motoristaId, String status);

}
