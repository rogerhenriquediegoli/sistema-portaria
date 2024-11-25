package com.seuprojeto.carmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "carro")
public class Carro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idcarro")
    private Long idCarro;

    @Column(name = "placa", nullable = false, unique = true)
    @Pattern(regexp = "^[A-Z]{3}[0-9][A-Z][0-9]{2}$", message = "Formato de placa inválido. Deve ser no formato ABC1D23.")
    private String placa;

    @Column(name = "modelo", nullable = false)
    @NotBlank(message = "O modelo do carro não pode ser vazio.")
    private String modelo;

    @Column(name = "capacidadetanque", nullable = false)
    @Positive(message = "A capacidade do tanque deve ser maior que 0.")
    private Integer capacidadeTanque;

    @Column(name = "consumomedio", nullable = false)
    @Positive(message = "O consumo médio deve ser maior que 0.")
    private Double consumoMedio;

    @Column(name = "quilometragematual", nullable = false)
    @Min(value = 0, message = "A quilometragem atual não pode ser negativa.")
    private Integer quilometragemAtual;

    @Column(name = "nivelcombustivelatual")
    private Double nivelCombustivelAtual;

    @Column(name = "status", nullable = false)
    @Pattern(regexp = "^(Disponível|Em uso|Reservado|Aguardando Revisão|Inativo)$", message = "O status deve ser um dos valores: 'Disponível', 'Em uso', 'Reservado', 'Aguardando Revisão', ou 'Inativo'.")
    private String status;

    // Getters e Setters
    public Long getIdCarro() {
        return idCarro;
    }

    public void setIdCarro(Long idCarro) {
        this.idCarro = idCarro;
    }

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

    public Integer getCapacidadeTanque() {
        return capacidadeTanque;
    }

    public void setCapacidadeTanque(Integer capacidadeTanque) {
        this.capacidadeTanque = capacidadeTanque;
    }

    public Double getConsumoMedio() {
        return consumoMedio;
    }

    public void setConsumoMedio(Double consumoMedio) {
        this.consumoMedio = consumoMedio;
    }

    public Integer getQuilometragemAtual() {
        return quilometragemAtual;
    }

    public void setQuilometragemAtual(Integer quilometragemAtual) {
        this.quilometragemAtual = quilometragemAtual;
    }

    public Double getNivelCombustivelAtual() {
        return nivelCombustivelAtual;
    }

    public void setNivelCombustivelAtual(Double nivelCombustivelAtual) {
        this.nivelCombustivelAtual = nivelCombustivelAtual;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
