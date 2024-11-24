package com.seuprojeto.carmanagement.controller;

import com.seuprojeto.carmanagement.model.Motorista;
import com.seuprojeto.carmanagement.service.MotoristaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/motoristas")
public class MotoristaController {

    @Autowired
    private MotoristaService motoristaService;

    @GetMapping
    public List<Motorista> getAllMotoristas() {
        return motoristaService.getAllMotoristas();
    }

    @GetMapping("/{cpf}")
    public ResponseEntity<Motorista> getMotoristaById(@PathVariable Long cpf) {
        Optional<Motorista> motorista = motoristaService.getMotoristaById(cpf);
        return motorista.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Motorista> createMotorista(@RequestBody Motorista motorista) {
        Motorista createdMotorista = motoristaService.createMotorista(motorista);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMotorista);
    }

    @PutMapping("/{cpf}")
    public ResponseEntity<Motorista> updateMotorista(@PathVariable Long cpf, @RequestBody Motorista motorista) {
        Motorista updatedMotorista = motoristaService.updateMotorista(cpf, motorista);
        return updatedMotorista != null ? ResponseEntity.ok(updatedMotorista) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{cpf}")
    public ResponseEntity<Void> deleteMotorista(@PathVariable Long cpf) {
        motoristaService.deleteMotorista(cpf);
        return ResponseEntity.noContent().build();
    }
}
