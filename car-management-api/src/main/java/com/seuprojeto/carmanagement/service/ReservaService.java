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

    public Reserva createReserva(Reserva reserva) {
        return reservaRepository.save(reserva);
    }

    public Reserva updateReserva(Long idReserva, Reserva reserva) {
        if (reservaRepository.existsById(idReserva)) {
            reserva.setIdReserva(idReserva);
            return reservaRepository.save(reserva);
        } else {
            return null;
        }
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

        // Verifica validade da CNH
        LocalDate validadeCnh = motorista.getValidadeCnh();
        if (ChronoUnit.DAYS.between(dataFim, validadeCnh) < 15) {
            throw new IllegalArgumentException("A data final da reserva não pode ser próxima do vencimento da CNH.");
        }

        // Atualiza status do carro
        carro.setStatus("Reservado");
        carroRepository.save(carro);

        // Cria a reserva
        Reserva reserva = new Reserva();
        reserva.setCarro(carro);
        reserva.setMotorista(motorista);
        reserva.setDataFim(dataFim);
        reserva.setStatus("Ativa");

        return reservaRepository.save(reserva);
    }


    /**
     * Cancela uma reserva existente.
     * @param idReserva ID da reserva a ser cancelada.
     */
    @Transactional
    public void cancelarReserva(Long idReserva) throws ChangeSetPersister.NotFoundException {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new ChangeSetPersister.NotFoundException());

        if ("Cancelada".equals(reserva.getStatus()) || "Concluído".equals(reserva.getStatus())) {
            throw new IllegalStateException("A reserva já foi cancelada ou concluída.");
        }

        reserva.setStatus("Cancelada");
        reservaRepository.save(reserva);

        carroService.alterarStatus(reserva.getCarro().getIdCarro(), "Disponível");
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

        carroService.alterarStatus(reserva.getCarro().getIdCarro(), "Disponível");
    }

    public void validarDataReserva(LocalDate dataFimReserva, LocalDate validadeCNH) {
        // Define o limite de proximidade (ex.: 15 dias antes do vencimento)
        long diasRestantes = ChronoUnit.DAYS.between(LocalDate.now(), validadeCNH);

        if (diasRestantes <= 15 && dataFimReserva.isAfter(validadeCNH.minusDays(15))) {
            throw new IllegalArgumentException("A data final da reserva não pode ser próxima do vencimento da CNH.");
        }
    }
}
