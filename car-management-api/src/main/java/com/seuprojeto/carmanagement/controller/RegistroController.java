package com.seuprojeto.carmanagement.controller;

import com.seuprojeto.carmanagement.model.Registro;
import com.seuprojeto.carmanagement.service.RegistroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/registros")
public class RegistroController {

    @Autowired
    private RegistroService registroService;

    @GetMapping
    public List<Registro> getAllRegistros() {
        return registroService.getAllRegistros();
    }

    @GetMapping("/{idRegistro}")
    public ResponseEntity<Registro> getRegistroById(@PathVariable Long idRegistro) {
        Optional<Registro> registro = registroService.getRegistroById(idRegistro);
        return registro.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Registro> createRegistro(@RequestBody Registro registro) {
        Registro createdRegistro = registroService.createRegistro(registro);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRegistro);
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
}
