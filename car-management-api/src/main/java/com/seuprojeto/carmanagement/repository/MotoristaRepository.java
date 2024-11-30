package com.seuprojeto.carmanagement.repository;
import org.springframework.data.jpa.repository.Query;
import com.seuprojeto.carmanagement.model.Motorista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MotoristaRepository extends JpaRepository<Motorista, Long> {

    @Query("""
        SELECT JSON_BUILD_OBJECT(
            'Disponível', COUNT(CASE WHEN m.status = 'Disponível' THEN 1 END),
            'Em Viagem', COUNT(CASE WHEN m.status = 'Em Viagem' THEN 1 END),
            'Inativos', COUNT(CASE WHEN m.status = 'Inativo' THEN 1 END)
        ) AS status_counts
        FROM Motorista m
    """)
    String countMotoristasByStatus();

    @Query(value = "SELECT m.* FROM motorista m WHERE m.status = 'Disponível' AND m.idmotorista NOT IN (SELECT r.motorista_id FROM reserva r WHERE r.status = 'Ativa')", nativeQuery = true)
    List<Motorista> findAvailableDrivers();

    @Query(value = "SELECT m.* FROM motorista m WHERE m.status = 'Disponível'", nativeQuery = true)
    List<Motorista> findAvailableDriversOnly();

    @Query(value = "SELECT m.* FROM motorista m WHERE m.status = 'Em Viagem'", nativeQuery = true)
    List<Motorista> findDriversInActivity();


    // Método para buscar motoristas com CNH vencida (a CNH é anterior à data fornecida)
    List<Motorista> findByValidadeCnhBeforeAndStatusNot(LocalDate validadeCnh, String status);

}
