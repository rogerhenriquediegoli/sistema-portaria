package com.seuprojeto.carmanagement.service;

import com.seuprojeto.carmanagement.model.Registro;
import com.seuprojeto.carmanagement.repository.RegistroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RegistroService {

    @Autowired
    private RegistroRepository registroRepository;

    public List<Registro> getAllRegistros() {
        return registroRepository.findAll();
    }

    public Optional<Registro> getRegistroById(Long idRegistro) {
        return registroRepository.findById(idRegistro);
    }

    public Registro createRegistro(Registro registro) {
        return registroRepository.save(registro);
    }

    public Registro updateRegistro(Long idRegistro, Registro registro) {
        if (registroRepository.existsById(idRegistro)) {
            registro.setIdRegistro(idRegistro);
            return registroRepository.save(registro);
        } else {
            return null;
        }
    }

    public void deleteRegistro(Long idRegistro) {
        registroRepository.deleteById(idRegistro);
    }
}
