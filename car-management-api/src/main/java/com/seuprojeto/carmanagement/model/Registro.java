package com.seuprojeto.carmanagement.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Registro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idregistro")
    private Long idRegistro;

    @ManyToOne
    @JoinColumn(name = "motorista_cpf", referencedColumnName = "cpf")
    private Motorista motorista;

    @ManyToOne
    @JoinColumn(name = "carro_placa", referencedColumnName = "placa")
    private Carro carro;

    @Column(name = "datasaida")
    private LocalDateTime dataSaida;

    @Column(name = "dataentrada")
    private LocalDateTime dataEntrada;

    @Column(name = "quilometragemsaida")
    private int quilometragemSaida;

    @Column(name = "quilometragementrada")
    private int quilometragemEntrada;

    @Column(name = "nivelcombustivelsaida")
    private Integer nivelCombustivelSaida;

    @Column(name = "nivelcombustivelentrada")
    private Integer nivelCombustivelEntrada;

    @Column(name = "abastecimentoextra")
    private Integer abastecimentoExtra;

    // Getters e Setters
    public Long getIdRegistro() {
        return idRegistro;
    }

    public void setIdRegistro(Long idRegistro) {
        this.idRegistro = idRegistro;
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

    public LocalDateTime getDataSaida() {
        return dataSaida;
    }

    public void setDataSaida(LocalDateTime dataSaida) {
        this.dataSaida = dataSaida;
    }

    public LocalDateTime getDataEntrada() {
        return dataEntrada;
    }

    public void setDataEntrada(LocalDateTime dataEntrada) {
        this.dataEntrada = dataEntrada;
    }

    public int getQuilometragemSaida() {
        return quilometragemSaida;
    }

    public void setQuilometragemSaida(int quilometragemSaida) {
        this.quilometragemSaida = quilometragemSaida;
    }

    public int getQuilometragemEntrada() {
        return quilometragemEntrada;
    }

    public void setQuilometragemEntrada(int quilometragemEntrada) {
        this.quilometragemEntrada = quilometragemEntrada;
    }

    public Integer getNivelCombustivelSaida() {
        return nivelCombustivelSaida;
    }

    public void setNivelCombustivelSaida(Integer nivelCombustivelSaida) {
        this.nivelCombustivelSaida = nivelCombustivelSaida;
    }

    public Integer getNivelCombustivelEntrada() {
        return nivelCombustivelEntrada;
    }

    public void setNivelCombustivelEntrada(Integer nivelCombustivelEntrada) {
        this.nivelCombustivelEntrada = nivelCombustivelEntrada;
    }

    public Integer getAbastecimentoExtra() {
        return abastecimentoExtra;
    }

    public void setAbastecimentoExtra(Integer abastecimentoExtra) {
        this.abastecimentoExtra = abastecimentoExtra;
    }
}
