package com.seuprojeto.carmanagement.service;

import com.seuprojeto.carmanagement.model.Carro;
import com.seuprojeto.carmanagement.repository.CarroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarroService {

    @Autowired
    private CarroRepository carroRepository;

    public List<Carro> getAllCarros() {
        return carroRepository.findAll();
    }

    public Optional<Carro> getCarroById(String placa) {
        return carroRepository.findById(placa);
    }

    public Carro createCarro(Carro carro) {
        return carroRepository.save(carro);
    }

    public Carro updateCarro(String placa, Carro carro) {
        if (carroRepository.existsById(placa)) {
            carro.setPlaca(placa);
            return carroRepository.save(carro);
        } else {
            return null;
        }
    }

    public void deleteCarro(String placa) {
        carroRepository.deleteById(placa);
    }
}
