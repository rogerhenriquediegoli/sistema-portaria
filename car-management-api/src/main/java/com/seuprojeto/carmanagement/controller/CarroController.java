package com.seuprojeto.carmanagement.controller;

import com.seuprojeto.carmanagement.model.Carro;
import com.seuprojeto.carmanagement.service.CarroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    @GetMapping("/{placa}")
    public ResponseEntity<Carro> getCarroById(@PathVariable String placa) {
        Optional<Carro> carro = carroService.getCarroById(placa);
        return carro.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Carro> createCarro(@RequestBody Carro carro) {
        Carro createdCarro = carroService.createCarro(carro);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCarro);
    }

    @PutMapping("/{placa}")
    public ResponseEntity<Carro> updateCarro(@PathVariable String placa, @RequestBody Carro carro) {
        Carro updatedCarro = carroService.updateCarro(placa, carro);
        return updatedCarro != null ? ResponseEntity.ok(updatedCarro) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{placa}")
    public ResponseEntity<Void> deleteCarro(@PathVariable String placa) {
        carroService.deleteCarro(placa);
        return ResponseEntity.noContent().build();
    }
}
