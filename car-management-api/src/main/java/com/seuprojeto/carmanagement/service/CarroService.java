package com.seuprojeto.carmanagement.service;

import com.seuprojeto.carmanagement.model.Carro;
import com.seuprojeto.carmanagement.repository.CarroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CarroService {

    @Autowired
    private CarroRepository carroRepository;

    private final List<String> allowedStatuses = List.of("Aguardando Revisão", "Inativo");

    public List<Carro> getAllCarros() {
        return carroRepository.findAll();
    }

    public Optional<Carro> getCarroById(Long id) {
        return carroRepository.findById(id);
    }

    @Transactional
    public Carro updateCarro(Long id, Carro carro) {
        Optional<Carro> existingCarro = carroRepository.findById(id);
        if (existingCarro.isEmpty()) {
            throw new IllegalArgumentException("Carro não encontrado. Verifique se o ID está correto.");
        }

        Carro carroToUpdate = existingCarro.get();

        // Validação de placa
        if (carro.getPlaca() != null && !carroToUpdate.getPlaca().equals(carro.getPlaca())) {
            if (!carro.getPlaca().matches("^[A-Z]{3}[0-9][A-Z][0-9]{2}$")) {
                throw new IllegalArgumentException("Formato de placa inválido. A placa deve seguir o formato ABC1D23.");
            }
            if (carroRepository.existsByPlaca(carro.getPlaca())) {
                throw new IllegalArgumentException("A placa informada já está cadastrada no sistema.");
            }
            carroToUpdate.setPlaca(carro.getPlaca());
        }

        // Validação de status
        if (carroToUpdate.getStatus().equals("Disponível")) {
            if (carro.getStatus() != null && !carro.getStatus().equals("Disponível") && !allowedStatuses.contains(carro.getStatus())) {
                throw new IllegalArgumentException("O status só pode ser alterado para 'Aguardando Revisão' ou 'Inativo'.");
            }
        } else if (carroToUpdate.getStatus().equals("Inativo")) {
            if (carro.getStatus() != null && !carro.getStatus().equals("Aguardando Revisão") && !carro.getStatus().equals("Inativo")) {
                throw new IllegalArgumentException("Carros 'Inativos' só podem ser alterados para 'Aguardando Revisão' ou mantidos como 'Inativo'.");
            }
        } else if (carroToUpdate.getStatus().equals("Aguardando Revisão")) {
            if (carro.getStatus() != null && !carro.getStatus().equals("Inativo") && !carro.getStatus().equals("Aguardando Revisão")) {
                throw new IllegalArgumentException("Carros que estão 'Aguardando Revisão' só podem ser alterados para 'Inativo' ou mantidos como 'Aguardando Revisão'.");
            }
        }

        if (carro.getStatus() != null) {
            carroToUpdate.setStatus(carro.getStatus());
        }

        // Não permite alteração de quilometragem
        if (carro.getQuilometragemAtual() != null) {
            throw new IllegalArgumentException("A quilometragem do carro não pode ser alterada após o cadastro.");
        }

        return carroRepository.save(carroToUpdate);
    }


    public void deleteCarro(Long id) {
        carroRepository.deleteById(id);
    }

    public String getCarrosCountByStatus() {
        return carroRepository.countCarrosByStatus();
    }

    public Carro createCarro(Carro carro) {
        validateCarro(carro); // Validações personalizadas
        return carroRepository.save(carro);
    }

    private void validateCarro(Carro carro) {
        if (!allowedStatuses.contains(carro.getStatus())) {
            throw new IllegalArgumentException("O status informado deve ser 'Aguardando Revisão' ou 'Inativo'.");
        }

        if (carro.getNivelCombustivelAtual() != null) {
            throw new IllegalArgumentException("O nível de combustível deve ser nulo ao cadastrar o carro.");
        }

        if (carro.getCapacidadeTanque() <= 0) {
            throw new IllegalArgumentException("A capacidade do tanque deve ser maior que 0.");
        }

        if (carro.getConsumoMedio() <= 0) {
            throw new IllegalArgumentException("O consumo médio deve ser maior que 0.");
        }

        if (carro.getQuilometragemAtual() < 0) {
            throw new IllegalArgumentException("A quilometragem atual não pode ser negativa.");
        }
    }

    public List<Carro> getAvailableCars() {
        return carroRepository.findAvailableCars();
    }

    @Transactional
    public void alterarStatus(Long idCarro, String novoStatus) throws ChangeSetPersister.NotFoundException {
        Carro carro = carroRepository.findById(idCarro)
                .orElseThrow(() -> new ChangeSetPersister.NotFoundException());
        carro.setStatus(novoStatus);
        carroRepository.save(carro);
    }

}
