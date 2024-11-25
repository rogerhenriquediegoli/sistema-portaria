package com.seuprojeto.carmanagement.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "reserva")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idreserva")
    private Long idReserva;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "motorista_id", referencedColumnName = "idmotorista", nullable = false)
    private Motorista motorista;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "carro_id", referencedColumnName = "idcarro", nullable = false)
    private Carro carro;

    @Column(name = "datafim", nullable = false)
    private LocalDate dataFim;

    @Column(name = "status", nullable = false, length = 20)
    private String status; // Valores possíveis: "Ativa", "Concluída", "Cancelada"

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

    public LocalDate getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDate dataFim) {
        this.dataFim = dataFim;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
