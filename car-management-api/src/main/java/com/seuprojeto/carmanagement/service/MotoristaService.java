package com.seuprojeto.carmanagement.service;

import com.seuprojeto.carmanagement.model.Motorista;
import com.seuprojeto.carmanagement.repository.MotoristaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MotoristaService {

    @Autowired
    private MotoristaRepository motoristaRepository;

    private final List<String> allowedStatuses = List.of("Disponível", "Inativo");

    public List<Motorista> getAllMotoristas() {
        return motoristaRepository.findAll();
    }

    public Optional<Motorista> getMotoristaById(Long id) {
        return motoristaRepository.findById(id);
    }

    public Motorista createMotorista(Motorista motorista) {
        validateMotorista(motorista);
        return motoristaRepository.save(motorista);
    }

    public Motorista updateMotorista(Long id, Motorista motorista) {
        if (!motoristaRepository.existsById(id)) {
            throw new IllegalArgumentException("Motorista não encontrado.");
        }

        Motorista existingMotorista = motoristaRepository.findById(id).get();

        // Verifica se o motorista está "Em Viagem"
        if ("Em Viagem".equals(existingMotorista.getStatus())) {
            throw new IllegalArgumentException("Não é possível editar o motorista enquanto estiver 'Em Viagem'.");
        }

        // Validando e atualizando apenas a validade da CNH e o status
        if (motorista.getValidadeCnh() != null) {
            if (motorista.getValidadeCnh().isBefore(existingMotorista.getValidadeCnh())) {
                throw new IllegalArgumentException("A validade da CNH deve ser uma data maior que a atual.");
            }
            existingMotorista.setValidadeCnh(motorista.getValidadeCnh());
        }

        if (motorista.getStatus() != null) {
            if (!allowedStatuses.contains(motorista.getStatus())) {
                throw new IllegalArgumentException("Status inválido. Use 'Disponível' ou 'Inativo'.");
            }
            existingMotorista.setStatus(motorista.getStatus());
        }

        return motoristaRepository.save(existingMotorista);
    }

    public void deleteMotorista(Long id) {
        motoristaRepository.deleteById(id);
    }

    public String getMotoristasCountByStatus() {
        return motoristaRepository.countMotoristasByStatus();
    }

    private void validateMotorista(Motorista motorista) {
        // Nome não pode ser vazio
        if (motorista.getNome() == null || motorista.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do motorista não pode ser vazio.");
        }

        // Validação de CPF
        if (motorista.getCpf() == null || !isValidCpf(motorista.getCpf())) {
            throw new IllegalArgumentException("CPF inválido.");
        }

        // CNH deve ter validade futura
        if (motorista.getValidadeCnh() == null || !motorista.getValidadeCnh().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("A validade da CNH deve ser uma data futura.");
        }

        // Status deve ser válido
        if (motorista.getStatus() == null || !allowedStatuses.contains(motorista.getStatus())) {
            throw new IllegalArgumentException("O status deve ser 'Disponível' ou 'Inativo'.");
        }
    }

    private boolean isValidCpf(Long cpf) {
        // Converte CPF para string e preenche com zeros à esquerda, se necessário
        String cpfStr = String.format("%011d", cpf);

        // Verifica se é uma sequência repetida
        if (cpfStr.matches("(\\d)\\1{10}")) {
            return false;
        }

        // Pesos para o primeiro e segundo dígitos
        int[] weightsFirst = {10, 9, 8, 7, 6, 5, 4, 3, 2};
        int[] weightsSecond = {11, 10, 9, 8, 7, 6, 5, 4, 3, 2};

        // Calcula os dígitos verificadores
        int firstDigit = calculateCpfDigit(cpfStr.substring(0, 9), weightsFirst);
        int secondDigit = calculateCpfDigit(cpfStr.substring(0, 10), weightsSecond);

        // Verifica os dígitos calculados com os informados
        return cpfStr.equals(cpfStr.substring(0, 9) + firstDigit + secondDigit);
    }

    private int calculateCpfDigit(String cpfPart, int[] weights) {
        int sum = 0;
        for (int i = 0; i < cpfPart.length(); i++) {
            sum += Character.getNumericValue(cpfPart.charAt(i)) * weights[i];
        }
        int remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    }

    public List<Motorista> getAvailableDrivers() {
        return motoristaRepository.findAvailableDrivers();
    }

}
