package com.seuprojeto.carmanagement.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idreserva")
    private Long idReserva;

    @ManyToOne
    @JoinColumn(name = "motorista_cpf", referencedColumnName = "cpf")
    private Motorista motorista;

    @ManyToOne
    @JoinColumn(name = "carro_placa", referencedColumnName = "placa")
    private Carro carro;

    @Column(name = "datafim")
    private LocalDateTime dataFim;

    @Column(name = "status")
    private String status;

    // Getters e Setters
    public Long getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Long idReserva) {
        this.idReserva = idReserva;
    }

    public Motorista getMotorista() {
        return motorista;
    }

    public void setMotorista(Motorista motorista) {
        this.motorista = motorista;
    }

    public Carro getCarro() {
        return carro;
    }

    public void setCarro(Carro carro) {
        this.carro = carro;
    }

    public LocalDateTime getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDateTime dataFim) {
        this.dataFim = dataFim;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
