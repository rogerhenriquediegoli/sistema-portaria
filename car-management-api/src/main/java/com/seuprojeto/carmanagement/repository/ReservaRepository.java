package com.seuprojeto.carmanagement.repository;

import com.seuprojeto.carmanagement.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    // Buscar reserva ativa vinculando carro e motorista
    Optional<Reserva> findByCarroIdAndMotoristaIdAndStatus(Long carroId, Long motoristaId, String status);

    boolean existsByMotoristaIdAndStatus(Long motoristaId, String status);

    List<Reserva> findByStatusAndDataFimBefore(String status, LocalDate dataFim);

}
