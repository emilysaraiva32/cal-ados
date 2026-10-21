
package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "lotes")
public class Lote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_lote")
    private Integer idLote;

    @Column(name = "numero_op", nullable = false, unique = true)
    private String numeroOp;

    @Column(name = "codigo_identificador",
            nullable = false, unique = true)
    private String codigoIdentificador;

    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "prazo_retorno")
    private LocalDateTime prazoRetorno;

    @Column(name = "tipo_servico", nullable = false)
    private String tipoServico;

    @Column(name = "quantidade_total", nullable = false)
    private Integer quantidadeTotal;

    @Column(name = "quantidade_aprovada", nullable = false)
    private Integer quantidadeAprovada = 0;

    @Column(name = "status_atual", nullable = false)
    private String statusAtual = "Criado";

    @Column(name = "id_banca", nullable = false)
    private Integer idBanca;

    @Column(name = "id_modelo", nullable = false)
    private Integer idModelo;

    @PrePersist
    public void preparar() {
        if (codigoIdentificador == null
                || codigoIdentificador.isBlank()) {
            codigoIdentificador = UUID.randomUUID().toString();
        }

        if (dataCriacao == null) {
            dataCriacao = LocalDateTime.now();
        }

        if (quantidadeAprovada == null) {
            quantidadeAprovada = 0;
        }

        if (statusAtual == null || statusAtual.isBlank()) {
            statusAtual = "Criado";
        }
    }

    public Integer getIdLote() {
        return idLote;
    }

    public String getNumeroOp() { return numeroOp; }
    public void setNumeroOp(String numeroOp) {
        this.numeroOp = numeroOp;
    }

    public String getCodigoIdentificador() {
        return codigoIdentificador;
    }
    public void setCodigoIdentificador(String codigo) {
        this.codigoIdentificador = codigo;
    }

    public LocalDateTime getDataCriacao() { return dataCriacao; }

    public LocalDateTime getPrazoRetorno() {
        return prazoRetorno;
    }
    public void setPrazoRetorno(LocalDateTime prazoRetorno) {
        this.prazoRetorno = prazoRetorno;
    }

    public String getTipoServico() { return tipoServico; }
    public void setTipoServico(String tipoServico) {
        this.tipoServico = tipoServico;
    }

    public Integer getQuantidadeTotal() { return quantidadeTotal; }
    public void setQuantidadeTotal(Integer quantidadeTotal) {
        this.quantidadeTotal = quantidadeTotal;
    }

    public Integer getQuantidadeAprovada() {
        return quantidadeAprovada;
    }
    public void setQuantidadeAprovada(Integer quantidadeAprovada) {
        this.quantidadeAprovada = quantidadeAprovada;
    }

    public String getStatusAtual() { return statusAtual; }
    public void setStatusAtual(String statusAtual) {
        this.statusAtual = statusAtual;
    }

    public Integer getIdBanca() { return idBanca; }
    public void setIdBanca(Integer idBanca) {
        this.idBanca = idBanca;
    }

    public Integer getIdModelo() { return idModelo; }
    public void setIdModelo(Integer idModelo) {
        this.idModelo = idModelo;
    }
}
