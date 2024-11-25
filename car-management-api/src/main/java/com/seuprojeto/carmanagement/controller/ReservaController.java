package com.seuprojeto.carmanagement.controller;

import com.seuprojeto.carmanagement.model.Carro;
import com.seuprojeto.carmanagement.model.Motorista;
import com.seuprojeto.carmanagement.model.Reserva;
import com.seuprojeto.carmanagement.service.CarroService;
import com.seuprojeto.carmanagement.service.MotoristaService;
import com.seuprojeto.carmanagement.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @Autowired
    private CarroService carroService;

    @Autowired
    private MotoristaService motoristaService;

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
    public String criarReserva(
            @RequestParam Long motoristaId,
            @RequestParam Long carroId,
            @RequestParam String dataFim) {

        // Converte a data de string para LocalDate
        LocalDate dataFimConvertida;
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            dataFimConvertida = LocalDate.parse(dataFim, formatter);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Formato de data inválido. Use 'yyyy-MM-dd'.");
        }

        // Chama o método do serviço para criar a reserva
        reservaService.createReserva(carroId, motoristaId, dataFimConvertida);
        return "Reserva criada com sucesso!";
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

    @GetMapping("/disponiveis")
    public ResponseEntity<Map<String, List<?>>> getAvailableResources() {
        List<Carro> availableCars = carroService.getAvailableCars();
        List<Motorista> availableDrivers = motoristaService.getAvailableDrivers();

        return ResponseEntity.ok(Map.of(
                "carrosDisponiveis", availableCars,
                "motoristasDisponiveis", availableDrivers
        ));
    }
}
