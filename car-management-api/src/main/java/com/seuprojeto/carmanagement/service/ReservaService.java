package com.seuprojeto.carmanagement.service;

import com.seuprojeto.carmanagement.model.Reserva;
import com.seuprojeto.carmanagement.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

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
}
