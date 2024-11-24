package com.seuprojeto.carmanagement.controller;

import com.seuprojeto.carmanagement.model.Reserva;
import com.seuprojeto.carmanagement.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @GetMapping
    public List<Reserva> getAllReservas() {
        return reservaService.getAllReservas();
    }

    @GetMapping("/{idReserva}")
    public ResponseEntity<Reserva> getReservaById(@PathVariable Long idReserva) {
        Optional<Reserva> reserva = reservaService.getReservaById(idReserva);
        return reserva.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Reserva> createReserva(@RequestBody Reserva reserva) {
        Reserva createdReserva = reservaService.createReserva(reserva);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReserva);
    }

    @PutMapping("/{idReserva}")
    public ResponseEntity<Reserva> updateReserva(@PathVariable Long idReserva, @RequestBody Reserva reserva) {
        Reserva updatedReserva = reservaService.updateReserva(idReserva, reserva);
        return updatedReserva != null ? ResponseEntity.ok(updatedReserva) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{idReserva}")
    public ResponseEntity<Void> deleteReserva(@PathVariable Long idReserva) {
        reservaService.deleteReserva(idReserva);
        return ResponseEntity.noContent().build();
    }
}
