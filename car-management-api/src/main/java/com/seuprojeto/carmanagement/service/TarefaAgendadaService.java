package com.seuprojeto.carmanagement.service;
import com.seuprojeto.carmanagement.model.Motorista;
import com.seuprojeto.carmanagement.model.Reserva;
import com.seuprojeto.carmanagement.service.MotoristaService;
import com.seuprojeto.carmanagement.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TarefaAgendadaService {

    @Autowired
    private ReservaService reservaService;

    @Autowired
    private MotoristaService motoristaService;

    // Método agendado para ser executado a cada 3 minutos
    @Scheduled(cron = "0 0/3 * * * ?") // Executa a cada 3 minutos
    @Transactional
    public void verificarReservasEMotoristas() {
        System.out.println("Teste");
        verificarReservas();
        verificarMotoristas();
    }

    // Verifica as reservas para ver se a data de fim já passou
    private void verificarReservas() {
        LocalDate hoje = LocalDate.now();

        // Obtém todas as reservas com status "Ativa" e que têm a data de fim anterior ou igual a hoje
        List<Reserva> reservas = reservaService.buscarReservasAtivasComDataFimAnterior(hoje);

        for (Reserva reserva : reservas) {
            try {
                reservaService.concluirReserva(reserva.getIdReserva());
                System.out.println("Reserva concluída com sucesso");
            } catch (Exception e) {
                // Log ou tratamento de erro se necessário
                System.out.println("Erro ao concluir reserva: " + reserva.getIdReserva());
            }
        }
    }

    // Verifica os motoristas para ver se a CNH venceu
    private void verificarMotoristas() {
        LocalDate hoje = LocalDate.now();

        // Obtém todos os motoristas que têm a CNH vencida
        List<Motorista> motoristas = motoristaService.buscarMotoristasComCnhVencida(hoje);

        for (Motorista motorista : motoristas) {
            if ("Em Viagem".equals(motorista.getStatus())) {
                // O motorista está em viagem, então aguardamos a viagem terminar antes de inativá-lo
                continue;
            }
            try {
                motoristaService.inativarMotorista(motorista.getIdMotorista());
                System.out.println("Motorista Inativado. Motivo: CNH Vencida: " + motorista.getIdMotorista());
            } catch (Exception e) {
                // Log ou tratamento de erro se necessário
                System.out.println("Erro ao inativar motorista: " + motorista.getIdMotorista());
            }
        }
    }
}
