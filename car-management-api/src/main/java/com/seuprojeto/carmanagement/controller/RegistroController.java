package com.seuprojeto.carmanagement.controller;

import com.seuprojeto.carmanagement.model.Carro;
import com.seuprojeto.carmanagement.model.Motorista;
import com.seuprojeto.carmanagement.model.Registro;
import com.seuprojeto.carmanagement.service.CarroService;
import com.seuprojeto.carmanagement.service.MotoristaService;
import com.seuprojeto.carmanagement.service.RegistroService;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/registros")
public class RegistroController {

    @Autowired
    private RegistroService registroService;

    @Autowired
    private CarroService carroService;

    @Autowired
    private MotoristaService motoristaService;

    @GetMapping
    public List<Registro> getAllRegistros() {
        return registroService.getAllRegistros();
    }

    @GetMapping("/{idRegistro}")
    public ResponseEntity<Registro> getRegistroById(@PathVariable Long idRegistro) {
        Optional<Registro> registro = registroService.getRegistroById(idRegistro);
        return registro.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/registroEntrada")
    public ResponseEntity<Object> registrarEntrada(@RequestParam @NotNull Long carroId,
                                                   @RequestParam @NotNull Long motoristaId,
                                                   @RequestParam @NotNull int quilometragemEntrada) {
        try {
            // Chama o serviço para registrar a entrada com a quilometragem informada
            Registro registroAtualizado = registroService.registrarEntrada(carroId, motoristaId, quilometragemEntrada);

            // Retorna o status 200 (OK) com o registro atualizado
            return ResponseEntity.ok(registroAtualizado);
        } catch (IllegalArgumentException e) {
            // Captura exceções e retorna a mensagem de erro no corpo da resposta
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())  // Exibe a mensagem de erro
            );
        }
    }

    @PostMapping("registroSaida")
    public ResponseEntity<?> createRegistro(@RequestParam Long carroId, @RequestParam Long motoristaId) {
        try {
            Registro registro = registroService.createRegistro(carroId, motoristaId);
            return ResponseEntity.status(HttpStatus.CREATED).body(registro);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (ChangeSetPersister.NotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    @PutMapping("/{idRegistro}")
    public ResponseEntity<Registro> updateRegistro(@PathVariable Long idRegistro, @RequestBody Registro registro) {
        Registro updatedRegistro = registroService.updateRegistro(idRegistro, registro);
        return updatedRegistro != null ? ResponseEntity.ok(updatedRegistro) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{idRegistro}")
    public ResponseEntity<Void> deleteRegistro(@PathVariable Long idRegistro) {
        registroService.deleteRegistro(idRegistro);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/validos")
    public ResponseEntity<Map<String, List<?>>> getReservedCarsAndAvailableDrivers() {
        List<Carro> reservedCars = carroService.getReservedCars();
        List<Motorista> availableDrivers = motoristaService.getAvailableDrivers();

        return ResponseEntity.ok(Map.of(
                "carrosReservados", reservedCars,
                "motoristasDisponiveis", availableDrivers
        ));
    }
}


