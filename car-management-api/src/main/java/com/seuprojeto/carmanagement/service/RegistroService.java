package com.seuprojeto.carmanagement.service;

import com.seuprojeto.carmanagement.model.Carro;
import com.seuprojeto.carmanagement.model.Motorista;
import com.seuprojeto.carmanagement.model.Registro;
import com.seuprojeto.carmanagement.model.Reserva;
import com.seuprojeto.carmanagement.repository.RegistroRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
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

    @Transactional
    public Registro createRegistro(Long carroId, Long motoristaId) throws ChangeSetPersister.NotFoundException {
        // Recupera os objetos Carro e Motorista
        Carro carro = carroService.getCarroById(carroId)
                .orElseThrow(() -> new IllegalArgumentException("Carro não encontrado ou inválido para uso."));
        Motorista motorista = motoristaService.getMotoristaById(motoristaId)
                .orElseThrow(() -> new IllegalArgumentException("Motorista não encontrado ou inválido para uso."));

        // Valida se o carro está disponível para uso
        if (!"Reservado".equals(carro.getStatus())) {
            throw new IllegalArgumentException("Carro não está reservado.");
        }

        // Valida se o motorista está disponível para viagem
        if (!"Disponível".equals(motorista.getStatus())) {
            throw new IllegalArgumentException("Motorista não está disponível.");
        }

        // Busca a reserva ativa entre o carro e o motorista
        Reserva reservaAtiva = reservaService.buscarReservaAtiva(carroId, motoristaId);

        if (reservaAtiva == null) {
            throw new IllegalArgumentException("Não existe uma reserva ativa vinculando o motorista e o carro.");
        }

        // Conclui a reserva (muda o status para 'Concluída')
        reservaService.concluirReserva(reservaAtiva.getIdReserva());

        // Criação do registro de viagem
        Registro registro = new Registro();
        registro.setCarroId(carro.getIdCarro());  // Usando apenas o ID
        registro.setMotoristaId(motorista.getIdMotorista());  // Usando apenas o ID
        registro.setDataSaida(LocalDateTime.now());
        registro.setQuilometragemSaida(carro.getQuilometragemAtual());
        registro.setNivelCombustivelSaida(carro.getNivelCombustivelAtual());

        // Atualiza os status do carro e do motorista
        carro.setStatus("Em uso");
        motorista.setStatus("Em Viagem");

        // Atualiza o carro e o motorista, usando os métodos simplificados
        carroService.updateCarroSimple(carro.getIdCarro(), carro); // Atualização simplificada
        motoristaService.updateMotoristaSimple(motorista.getIdMotorista(), motorista); // Atualização simplificada

        // Salva o registro de viagem
        return registroRepository.save(registro);
    }

    @Transactional
    public Registro registrarEntrada(Long carroId, Long motoristaId, int quilometragemEntrada) {
        // Recupera o registro ativo de viagem
        Registro registro = registroRepository.findTopByCarroIdAndMotoristaIdOrderByDataSaidaDesc(carroId, motoristaId)
                .orElseThrow(() -> new IllegalArgumentException("Não foi encontrada uma viagem ativa para o carro e motorista informados."));

        // Valida se a quilometragem de entrada já foi registrada
        if (registro.getQuilometragemEntrada() != null) {
            throw new IllegalArgumentException("Este registro já foi finalizado.");
        }

        Carro carro = carroService.getCarroById(carroId)
                .orElseThrow(() -> new IllegalArgumentException("Carro não encontrado."));

        Motorista motorista = motoristaService.getMotoristaById(motoristaId)
                .orElseThrow(() -> new IllegalArgumentException("Motorista não encontrado."));

        // Verifica se a quilometragem de entrada é maior que a de saída
        if (quilometragemEntrada <= registro.getQuilometragemSaida()) {
            throw new IllegalArgumentException("A quilometragem de entrada deve ser maior que a de saída.");
        }

        // Calcula a quilometragem rodada
        int quilometragemRodada = quilometragemEntrada - registro.getQuilometragemSaida();

        // Calcula o combustível consumido (km / consumo médio)
        double combustivelConsumido = quilometragemRodada / carro.getConsumoMedio();

        // Calcula o nível de combustível de entrada
        double nivelCombustivelEntrada = registro.getNivelCombustivelSaida() - combustivelConsumido;

        // Se o combustível consumido foi maior que o nível de combustível de saída, calcular o abastecimento extra
        double abastecimentoExtra = nivelCombustivelEntrada < 0 ? Math.abs(nivelCombustivelEntrada) : 0;

        // Atualiza o registro com a data de entrada, quilometragem de entrada, nível de combustível e abastecimento extra
        registro.setDataEntrada(LocalDateTime.now());
        registro.setQuilometragemEntrada(quilometragemEntrada);
        registro.setNivelCombustivelEntrada(nivelCombustivelEntrada < 0 ? 0 : nivelCombustivelEntrada); // Se o combustível de entrada for negativo, considera 0
        registro.setAbastecimentoExtra(abastecimentoExtra);

        // Atualiza o status do motorista para "Disponível"
        motorista.setStatus("Disponível");
        motoristaService.updateMotoristaSimple(motorista.getIdMotorista(), motorista);

        // Atualiza o status do carro para "Aguardando Revisão"
        carro.setStatus("Aguardando Revisão");
        carro.setQuilometragemAtual(quilometragemEntrada); // Atualiza a quilometragem do carro
        carro.setNivelCombustivelAtual(nivelCombustivelEntrada < 0 ? 0 : nivelCombustivelEntrada); // Atualiza o nível de combustível do carro
        carroService.updateCarroSimple(carro.getIdCarro(), carro); // Atualiza o carro

        // Salva o registro atualizado
        return registroRepository.save(registro);
    }
}
