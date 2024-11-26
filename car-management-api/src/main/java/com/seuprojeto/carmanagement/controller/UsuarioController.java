package com.seuprojeto.carmanagement.controller;

import com.seuprojeto.carmanagement.model.Usuario;
import com.seuprojeto.carmanagement.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioService.getAllUsuarios();
    }

    @GetMapping("/{idUsuario}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Long idUsuario) {
        Optional<Usuario> usuario = usuarioService.getUsuarioById(idUsuario);
        return usuario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint para cadastro de usuário
    @PostMapping("/cadastro")
    public ResponseEntity<?> createUsuario(@RequestBody @Valid Usuario usuario) {
        try {
            Usuario createdUsuario = usuarioService.cadastrarUsuario(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUsuario);
        } catch (IllegalArgumentException e) {
            // Caso ocorra uma IllegalArgumentException, retornamos a mensagem de erro
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            // Caso ocorra uma outra exceção inesperada, retornamos uma mensagem genérica
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno. Tente novamente mais tarde.");
        }
    }

    @PutMapping("/{idUsuario}")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable Long idUsuario, @RequestBody Usuario usuario) {
        Usuario updatedUsuario = usuarioService.updateUsuario(idUsuario, usuario);
        return updatedUsuario != null ? ResponseEntity.ok(updatedUsuario) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{idUsuario}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long idUsuario) {
        usuarioService.deleteUsuario(idUsuario);
        return ResponseEntity.noContent().build();
    }

    // Endpoint de Login
    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestParam String identificador, @RequestParam String senha) {
        try {
            Long idUsuario = usuarioService.login(identificador, senha);
            return ResponseEntity.ok(idUsuario);  // Retorna o ID do usuário logado
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());  // Mensagem de erro no login
        }
    }
}
