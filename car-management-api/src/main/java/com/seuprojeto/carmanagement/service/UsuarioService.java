package com.seuprojeto.carmanagement.service;

import com.seuprojeto.carmanagement.model.Usuario;
import com.seuprojeto.carmanagement.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> getUsuarioById(Long idUsuario) {
        return usuarioRepository.findById(idUsuario);
    }

    public Usuario createUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario updateUsuario(Long idUsuario, Usuario usuario) {
        if (usuarioRepository.existsById(idUsuario)) {
            usuario.setIdUsuario(idUsuario);
            return usuarioRepository.save(usuario);
        } else {
            return null;
        }
    }

    public void deleteUsuario(Long idUsuario) {
        usuarioRepository.deleteById(idUsuario);
    }
}
