package com.seuprojeto.carmanagement.service;

import com.seuprojeto.carmanagement.model.Carro;
import com.seuprojeto.carmanagement.repository.CarroRepository;
import org.springframework.beans.BeanUtils;
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
            // Verifica se a placa segue o formato correto
            if (!carro.getPlaca().matches("^[A-Z]{3}[0-9][A-Z][0-9]{2}$")) {
                throw new IllegalArgumentException("Formato de placa inválido. A placa deve seguir o formato ABC1D23.");
            }

            // Verifica se a placa já está registrada no sistema
            if (carroRepository.existsByPlaca(carro.getPlaca())) {
                throw new IllegalArgumentException("A placa informada já está cadastrada no sistema. A placa deve ser única.");
            }

            // Atualiza a placa do carro
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

        // Atualiza o status do carro
        if (carro.getStatus() != null) {
            carroToUpdate.setStatus(carro.getStatus());
        }

        // Não permite alteração de quilometragem
        if (carro.getQuilometragemAtual() != null) {
            throw new IllegalArgumentException("A quilometragem do carro não pode ser alterada após o cadastro.");
        }

        return carroRepository.save(carroToUpdate);
    }


    // Método de atualização simples, sem especificar cada campo
    public Carro updateCarroSimple(Long carroId, Carro carro) {
        Carro carroExistente = carroRepository.findById(carroId)
                .orElseThrow(() -> new IllegalArgumentException("Carro não encontrado"));

        // Copia todas as propriedades do objeto carro (exceto o ID) para o carroExistente
        BeanUtils.copyProperties(carro, carroExistente, "idCarro"); // Ignora o idCarro para não sobrescrever

        // Salva a atualização no banco de dados
        return carroRepository.save(carroExistente);
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
        // Verificar se o status é permitido
        if (!allowedStatuses.contains(carro.getStatus())) {
            throw new IllegalArgumentException("O status informado deve ser 'Aguardando Revisão' ou 'Inativo'.");
        }

        // Verificar se o nível de combustível está nulo no cadastro de um carro novo
        if (carro.getNivelCombustivelAtual() != null) {
            throw new IllegalArgumentException("O nível de combustível deve ser nulo ao cadastrar o carro.");
        }

        // Verificar se a capacidade do tanque é maior que 0
        if (carro.getCapacidadeTanque() <= 0) {
            throw new IllegalArgumentException("A capacidade do tanque deve ser maior que 0.");
        }

        // Verificar se o consumo médio é maior que 0
        if (carro.getConsumoMedio() <= 0) {
            throw new IllegalArgumentException("O consumo médio deve ser maior que 0.");
        }

        // Verificar se a quilometragem atual não é negativa
        if (carro.getQuilometragemAtual() < 0) {
            throw new IllegalArgumentException("A quilometragem atual não pode ser negativa.");
        }

        // Verificar se a placa é única no sistema
        if (carroRepository.existsByPlaca(carro.getPlaca())) {
            throw new IllegalArgumentException("Já existe um carro cadastrado com a placa " + carro.getPlaca() + ". A placa deve ser única.");
        }

        // Verificar se a placa segue o padrão "AAA1A11" (três letras, um número, uma letra e dois números)
        String placa = carro.getPlaca();
        String placaRegex = "^[A-Z]{3}\\d[A-Z]\\d{2}$";  // Expressão regular para o padrão AAA1A11

        if (placa == null || !placa.matches(placaRegex)) {
            throw new IllegalArgumentException("A placa deve seguir o padrão oficial AAA1A11, com três letras, um número, uma letra e dois números.");
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

    public List<Carro> getReservedCars() {
        return carroRepository.findReservedCars();
    }

    public List<Carro> getCarsBeingUsed() {
        return carroRepository.findCarsBeingUsed();
    }

    public List<Carro> getCarsWaitingForReview() {
        return carroRepository.findCarsWaitingForReview();
    }

    @Transactional
    public void alterarStatusParaDisponivel(Long carroId, Double novoNivelCombustivel, Integer novaQuilometragem) {
        // Recupera o carro pelo ID
        Carro carro = getCarroById(carroId)
                .orElseThrow(() -> new IllegalArgumentException("Carro não encontrado."));

        // Verifica se o status do carro está "Aguardando Revisão"
        if (!"Aguardando Revisão".equals(carro.getStatus())) {
            throw new IllegalArgumentException("O carro não está em status 'Aguardando Revisão'. Não é possível alterar o status.");
        }

        // Atualiza o status para "Disponível"
        carro.setStatus("Disponível");

        // Se o novo nível de combustível for informado e válido
        if (novoNivelCombustivel != null) {
            // Verifica se o novo nível de combustível é maior que 0 e não é nulo
            if (novoNivelCombustivel <= 0) {
                throw new IllegalArgumentException("O nível de combustível não pode ser igual ou menor que 0.");
            }

            // Verifica se o novo nível de combustível não ultrapassa a capacidade do tanque
            if (novoNivelCombustivel > carro.getCapacidadeTanque()) {
                throw new IllegalArgumentException("O nível de combustível não pode ser maior que a capacidade do tanque (" + carro.getCapacidadeTanque() + ").");
            }

            // Verifica se o novo nível de combustível não é menor que o nível atual
            if (carro.getNivelCombustivelAtual() != null && novoNivelCombustivel < carro.getNivelCombustivelAtual()) {
                throw new IllegalArgumentException("O novo nível de combustível não pode ser menor que o nível atual.");
            }

            // Atualiza o nível de combustível do carro
            carro.setNivelCombustivelAtual(novoNivelCombustivel);
        } else {
            throw new IllegalArgumentException("O nível de combustível não pode ser nulo.");
        }

        // Se a nova quilometragem for informada e válida
        if (novaQuilometragem != null) {
            // Verifica se a nova quilometragem é maior que 0
            if (novaQuilometragem <= 0) {
                throw new IllegalArgumentException("A quilometragem não pode ser igual ou menor que 0.");
            }

            // Valida se a nova quilometragem é maior que a atual
            if (novaQuilometragem < carro.getQuilometragemAtual()) {
                throw new IllegalArgumentException("A nova quilometragem não pode ser menor que a quilometragem atual.");
            }

            // Atualiza a quilometragem do carro
            carro.setQuilometragemAtual(novaQuilometragem);
        } else {
            throw new IllegalArgumentException("A quilometragem não pode ser nula.");
        }

        // Atualiza o carro no banco de dados
        updateCarroSimple(carro.getIdCarro(), carro);
    }

}
