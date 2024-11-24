package com.seuprojeto.carmanagement.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Carro {
    @Id
    @Column(name = "placa")
    private String placa;

    @Column(name = "modelo")
    private String modelo;

    @Column(name = "status")
    private String status;

    @Column(name = "quilometragematual")  // Coluna sem sublinhado
    private int quilometragemAtual;

    @Column(name = "capacidadetanque")  // Coluna sem sublinhado
    private int capacidadeTanque;

    @Column(name = "nivelcombustivelatual")  // Coluna sem sublinhado
    private Integer nivelCombustivelAtual;

    @Column(name = "consumomedio")  // Coluna sem sublinhado
    private int consumoMedio;

    // Getters e Setters
    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getQuilometragemAtual() {
        return quilometragemAtual;
    }

    public void setQuilometragemAtual(int quilometragemAtual) {
        this.quilometragemAtual = quilometragemAtual;
    }

    public int getCapacidadeTanque() {
        return capacidadeTanque;
    }

    public void setCapacidadeTanque(int capacidadeTanque) {
        this.capacidadeTanque = capacidadeTanque;
    }

    public Integer getNivelCombustivelAtual() {
        return nivelCombustivelAtual;
    }

    public void setNivelCombustivelAtual(Integer nivelCombustivelAtual) {
        this.nivelCombustivelAtual = nivelCombustivelAtual;
    }

    public int getConsumoMedio() {
        return consumoMedio;
    }

    public void setConsumoMedio(int consumoMedio) {
        this.consumoMedio = consumoMedio;
    }
}
