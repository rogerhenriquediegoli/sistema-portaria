package com.seuprojeto.carmanagement.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.math.BigInteger;
import java.time.LocalDate;

@Entity
@Table(name = "motorista")
public class Motorista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idmotorista")
    private Long idMotorista;

    @Column(name = "cpf", unique = true, nullable = false)
    private Long cpf;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "status", nullable = false)
    private String status;

    @JsonFormat (pattern = "yyyy-MM-dd")
    @Column(name = "validade_cnh", nullable = false)
    private LocalDate validadeCnh;

    // Getters e Setters
    public Long getIdMotorista() {
        return idMotorista;
    }

    public void setIdMotorista(Long idMotorista) {
        this.idMotorista = idMotorista;
    }

    public Long getCpf() {
        return cpf;
    }

    public void setCpf(Long cpf) {
        this.cpf = cpf;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getValidadeCnh() {
        return validadeCnh;
    }

    public void setValidadeCnh(LocalDate validadeCnh) {
        this.validadeCnh = validadeCnh;
    }
}
