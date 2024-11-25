package com.seuprojeto.carmanagement.service;

import com.seuprojeto.carmanagement.model.Carro;
import com.seuprojeto.carmanagement.model.Motorista;
import com.seuprojeto.carmanagement.model.Registro;
import com.seuprojeto.carmanagement.repository.RegistroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RegistroService {

    @Autowired
    private RegistroRepository registroRepository;

    @Autowired
    private CarroService carroService;

    @Autowired
    private MotoristaService motoristaService;

    @Autowired
    private ReservaService reservaService; // Necessário para verificar reservas

    public List<Registro> getAllRegistros() {
        return registroRepository.findAll();
    }

    public Optional<Registro> getRegistroById(Long idRegistro) {
        return registroRepository.findById(idRegistro);
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

    public Registro createRegistro(Long carroId, Long motoristaId) {
        // Validações
        Carro carro = carroService.getCarroById(carroId)
                .orElseThrow(() -> new IllegalArgumentException("Carro não encontrado ou inválido para uso."));
        if (!"Reservado".equals(carro.getStatus())) {
            throw new IllegalArgumentException("Carro não está reservado.");
        }

        Motorista motorista = motoristaService.getMotoristaById(motoristaId)
                .orElseThrow(() -> new IllegalArgumentException("Motorista não encontrado ou inválido para uso."));
        if (!"Disponível".equals(motorista.getStatus())) {
            throw new IllegalArgumentException("Motorista não está disponível.");
        }

        // Verifica se há reserva ativa entre o carro e o motorista
        if (!isReservationActive(carroId, motoristaId)) {
            throw new IllegalArgumentException("Não existe uma reserva ativa vinculando o motorista e o carro.");
        }

        // Criação do registro
        Registro registro = new Registro();
        registro.setCarroId(carro.getIdCarro());  // Usando apenas o ID
        registro.setMotoristaId(motorista.getIdMotorista());  // Usando apenas o ID
        registro.setDataSaida(LocalDateTime.now());
        registro.setQuilometragemSaida(carro.getQuilometragemAtual());
        registro.setNivelCombustivelSaida(carro.getNivelCombustivelAtual());

        // Atualiza o status do carro e motorista
        carro.setStatus("Em uso");
        motorista.setStatus("Em viagem");
        carroService.updateCarro(carro.getIdCarro(), carro);
        motoristaService.updateMotorista(motorista.getIdMotorista(), motorista);

        return registroRepository.save(registro);
    }

    /**
     * Verifica se existe uma reserva ativa para o motorista e o carro informados.
     *
     * @param carroId     ID do carro.
     * @param motoristaId ID do motorista.
     * @return true se existe uma reserva ativa; false caso contrário.
     */
    public boolean isReservationActive(Long carroId, Long motoristaId) {
        return reservaService.existsByCarroIdAndMotoristaIdAndStatus(carroId, motoristaId, "Ativa");
    }

}
