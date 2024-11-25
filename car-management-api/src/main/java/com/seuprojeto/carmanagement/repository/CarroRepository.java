package com.seuprojeto.carmanagement.repository;

import com.seuprojeto.carmanagement.model.Carro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface CarroRepository extends JpaRepository<Carro, Long> { // Alterado String para Long

    // Consulta personalizada para contar carros por status
    @Query("""
    SELECT JSON_BUILD_OBJECT(
        'Disponível', COUNT(CASE WHEN c.status = 'Disponível' THEN 1 END),
        'Em uso', COUNT(CASE WHEN c.status = 'Em uso' THEN 1 END),
        'Aguardando Revisão', COUNT(CASE WHEN c.status = 'Aguardando Revisão' THEN 1 END),
        'Reservado', COUNT(CASE WHEN c.status = 'Reservado' THEN 1 END),
        'Inativo', COUNT(CASE WHEN c.status = 'Inativo' THEN 1 END)
    ) AS status_counts
    FROM Carro c
    """)
    String countCarrosByStatus();
    // Método para verificar se já existe um carro com a mesma placa
    boolean existsByPlaca(String placa);

    @Query("SELECT c FROM Carro c WHERE c.status = 'Disponível'")
    List<Carro> findAvailableCars();

}
