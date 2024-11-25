package com.seuprojeto.carmanagement.service;

import com.seuprojeto.carmanagement.model.Carro;
import com.seuprojeto.carmanagement.model.Motorista;
import com.seuprojeto.carmanagement.model.Reserva;
import com.seuprojeto.carmanagement.repository.CarroRepository;
import com.seuprojeto.carmanagement.repository.MotoristaRepository;
import com.seuprojeto.carmanagement.repository.ReservaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private CarroRepository carroRepository;

    @Autowired
    private MotoristaRepository motoristaRepository;

    @Autowired
    private CarroService carroService;

    public List<Reserva> getAllReservas() {
        return reservaRepository.findAll();
    }

    public Optional<Reserva> getReservaById(Long idReserva) {
        return reservaRepository.findById(idReserva);
    }

    public void deleteReserva(Long idReserva) {
        reservaRepository.deleteById(idReserva);
    }

    public Reserva createReserva(Long carroId, Long motoristaId, LocalDate dataFim) {
        // Verifica se o carro existe e está disponível
        Carro carro = carroRepository.findById(carroId)
                .orElseThrow(() -> new IllegalArgumentException("Carro não encontrado."));
        if (!"Disponível".equals(carro.getStatus())) {
            throw new IllegalArgumentException("O carro selecionado não está disponível para reserva.");
        }

        // Verifica se o motorista existe e está disponível
        Motorista motorista = motoristaRepository.findById(motoristaId)
                .orElseThrow(() -> new IllegalArgumentException("Motorista não encontrado."));
        if (!"Disponível".equals(motorista.getStatus())) {
            throw new IllegalArgumentException("O motorista selecionado não está disponível para reserva.");
        }

        // Valida proximidade da data de vencimento da CNH
        validarDataReserva(dataFim, motorista.getValidadeCnh());

        // Criação da reserva
        Reserva reserva = new Reserva();
        reserva.setCarroId(carro.getIdCarro());  // Usando o ID do carro
        reserva.setMotoristaId(motorista.getIdMotorista());  // Usando o ID do motorista
        reserva.setDataFim(dataFim);
        reserva.setStatus("Ativa");

        // Atualiza o status do carro
        carro.setStatus("Reservado");
        carroRepository.save(carro);

        return reservaRepository.save(reserva);
    }


    public void validarDataReserva(LocalDate dataFimReserva, LocalDate validadeCNH) {
        // Verifica se a data de fim da reserva é futura
        if (!dataFimReserva.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "A data final da reserva deve ser uma data futura. Não pode ser a data atual nem uma data anterior."
            );
        }

        // Verifica se há pelo menos 15 dias de diferença entre a data final da reserva e a validade da CNH
        long diasEntre = ChronoUnit.DAYS.between(dataFimReserva, validadeCNH);

        if (diasEntre < 15) {
            throw new IllegalArgumentException(
                    "Não é permitido criar a reserva. É necessário que a data final da reserva seja, no mínimo, 15 dias antes do vencimento da CNH."
            );
        }
    }

    /**
     * Cancela uma reserva existente.
     * @param idReserva ID da reserva a ser cancelada.
     */
    @Transactional
    public void cancelarReserva(Long idReserva) throws ChangeSetPersister.NotFoundException {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(ChangeSetPersister.NotFoundException::new);

        if ("Cancelada".equals(reserva.getStatus()) || "Concluído".equals(reserva.getStatus())) {
            throw new IllegalStateException("A reserva já foi cancelada ou concluída.");
        }

        reserva.setStatus("Cancelada");
        reservaRepository.save(reserva);

        carroService.alterarStatus(reserva.getCarroId(), "Disponível");
    }

    /**
     * Conclui uma reserva existente.
     * @param idReserva ID da reserva a ser concluída.
     */
    @Transactional
    public void concluirReserva(Long idReserva) throws ChangeSetPersister.NotFoundException {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new ChangeSetPersister.NotFoundException());

        if (!"Ativa".equals(reserva.getStatus())) {
            throw new IllegalStateException("A reserva só pode ser concluída se estiver ativa.");
        }

        reserva.setStatus("Concluído");
        reservaRepository.save(reserva);

        carroService.alterarStatus(reserva.getCarroId(), "Disponível");
    }

    /**
     * Verifica se existe uma reserva ativa para o carro e motorista.
     *
     * @param carroId     ID do carro.
     * @param motoristaId ID do motorista.
     * @return true se existe uma reserva ativa; false caso contrário.
     */
    public boolean existsByCarroIdAndMotoristaIdAndStatus(Long carroId, Long motoristaId, String status) {
        return reservaRepository.existsByCarroIdAndMotoristaIdAndStatus(carroId, motoristaId, status);
    }
}
