package com.seuprojeto.carmanagement.repository;

import com.seuprojeto.carmanagement.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    // Método derivado que automaticamente gera a consulta para verificar se existe uma reserva ativa
    boolean existsByCarroIdAndMotoristaIdAndStatus(Long carroId, Long motoristaId, String status);

}
