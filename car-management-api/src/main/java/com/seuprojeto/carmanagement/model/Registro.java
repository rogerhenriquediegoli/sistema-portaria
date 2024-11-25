package com.seuprojeto.carmanagement.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registro")
public class Registro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idregistro")
    private Long idRegistro;

    @ManyToOne
    @JoinColumn(name = "motorista_id", referencedColumnName = "idmotorista")
    private Motorista motorista;

    @ManyToOne
    @JoinColumn(name = "carro_id", referencedColumnName = "idcarro")
    private Carro carro;

    @Column(name = "datasaida", nullable = false)
    private LocalDateTime dataSaida;

    @Column(name = "dataentrada")
    private LocalDateTime dataEntrada;

    @Column(name = "quilometragemsaida", nullable = false)
    private Integer quilometragemSaida;

    @Column(name = "quilometragementrada")
    private Integer quilometragemEntrada;

    @Column(name = "nivelcombustivelsaida", nullable = false)
    private Double nivelCombustivelSaida;

    @Column(name = "nivelcombustivelentrada")
    private Double nivelCombustivelEntrada;

    @Column(name = "abastecimentoextra")
    private Double abastecimentoExtra;

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

    public Integer getQuilometragemSaida() {
        return quilometragemSaida;
    }

    public void setQuilometragemSaida(Integer quilometragemSaida) {
        this.quilometragemSaida = quilometragemSaida;
    }

    public Integer getQuilometragemEntrada() {
        return quilometragemEntrada;
    }

    public void setQuilometragemEntrada(Integer quilometragemEntrada) {
        this.quilometragemEntrada = quilometragemEntrada;
    }

    public Double getNivelCombustivelSaida() {
        return nivelCombustivelSaida;
    }

    public void setNivelCombustivelSaida(Double nivelCombustivelSaida) {
        this.nivelCombustivelSaida = nivelCombustivelSaida;
    }

    public Double getNivelCombustivelEntrada() {
        return nivelCombustivelEntrada;
    }

    public void setNivelCombustivelEntrada(Double nivelCombustivelEntrada) {
        this.nivelCombustivelEntrada = nivelCombustivelEntrada;
    }

    public Double getAbastecimentoExtra() {
        return abastecimentoExtra;
    }

    public void setAbastecimentoExtra(Double abastecimentoExtra) {
        this.abastecimentoExtra = abastecimentoExtra;
    }
}
