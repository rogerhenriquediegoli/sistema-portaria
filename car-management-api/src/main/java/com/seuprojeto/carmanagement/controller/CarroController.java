package com.seuprojeto.carmanagement.controller;

import com.seuprojeto.carmanagement.model.Carro;
import com.seuprojeto.carmanagement.service.CarroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/carros")
public class CarroController {

    @Autowired
    private CarroService carroService;

    @GetMapping
    public List<Carro> getAllCarros() {
        return carroService.getAllCarros();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Carro> getCarroById(@PathVariable Long id) {
        Optional<Carro> carro = carroService.getCarroById(id);
        return carro.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Carro> updateCarro(@PathVariable Long id, @RequestBody Carro carro) {
        carro.setIdCarro(id);  // Atribuindo o ID da URL ao corpo da requisição
        try {
            Carro updatedCarro = carroService.updateCarro(id, carro);
            return ResponseEntity.ok(updatedCarro);
        } catch (IllegalArgumentException e) {
            // Retorna a mensagem de erro com um status 400 e o erro no corpo
            return ResponseEntity.badRequest().body(new Carro());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCarro(@PathVariable Long id) {
        carroService.deleteCarro(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint para contar carros por status
    @GetMapping("/count-status")
    public ResponseEntity<String> getCarrosCountByStatus() {
        String countByStatus = carroService.getCarrosCountByStatus();
        return ResponseEntity.ok(countByStatus);
    }

    @PostMapping
    public ResponseEntity<?> createCarro(@RequestBody Carro carro) {
        try {
            Carro createdCarro = carroService.createCarro(carro);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCarro);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Erro ao cadastrar carro."));
        }
    }
}
