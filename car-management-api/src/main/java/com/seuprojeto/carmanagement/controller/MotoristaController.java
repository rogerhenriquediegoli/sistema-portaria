package com.seuprojeto.carmanagement.controller;

import com.seuprojeto.carmanagement.model.Motorista;
import com.seuprojeto.carmanagement.service.MotoristaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/motoristas")
public class MotoristaController {

    @Autowired
    private MotoristaService motoristaService;

    @GetMapping
    public List<Motorista> getAllMotoristas() {
        return motoristaService.getAllMotoristas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Motorista> getMotoristaById(@PathVariable Long id) {
        return motoristaService.getMotoristaById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createMotorista(@RequestBody Motorista motorista) {
        try {
            Motorista createdMotorista = motoristaService.createMotorista(motorista);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMotorista);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMotorista(@PathVariable Long id, @RequestBody Motorista motorista) {
        try {
            Motorista updatedMotorista = motoristaService.updateMotorista(id, motorista);
            return ResponseEntity.ok(updatedMotorista);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMotorista(@PathVariable Long id) {
        motoristaService.deleteMotorista(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count-status")
    public ResponseEntity<String> getMotoristasCountByStatus() {
        String countByStatus = motoristaService.getMotoristasCountByStatus();
        return ResponseEntity.ok(countByStatus);
    }

}
