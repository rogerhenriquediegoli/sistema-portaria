package com.seuprojeto.carmanagement.service;

import com.seuprojeto.carmanagement.model.Motorista;
import com.seuprojeto.carmanagement.repository.MotoristaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MotoristaService {

    @Autowired
    private MotoristaRepository motoristaRepository;

    public List<Motorista> getAllMotoristas() {
        return motoristaRepository.findAll();
    }

    public Optional<Motorista> getMotoristaById(Long cpf) {
        return motoristaRepository.findById(cpf);
    }

    public Motorista createMotorista(Motorista motorista) {
        return motoristaRepository.save(motorista);
    }

    public Motorista updateMotorista(Long cpf, Motorista motorista) {
        if (motoristaRepository.existsById(cpf)) {
            motorista.setCpf(String.valueOf(cpf));
            return motoristaRepository.save(motorista);
        } else {
            return null;
        }
    }

    public void deleteMotorista(Long cpf) {
        motoristaRepository.deleteById(cpf);
    }
}
