
package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacoes")
public class Movimentacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimentacao")
    private Integer idMovimentacao;

    @Column(name = "id_lote", nullable = false)
    private Integer idLote;

    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario;

    @Column(name = "status_anterior")
    private String statusAnterior;

    @Column(name = "status_novo", nullable = false)
    private String statusNovo;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @Column(name = "observacao", columnDefinition = "TEXT")
    private String observacao;

    @PrePersist
    public void preparar() {
        if (dataHora == null) {
            dataHora = LocalDateTime.now();
        }
    }

    public Integer getIdMovimentacao() {
        return idMovimentacao;
    }

public Integer getIdLote() {
    return idLote;
}

public void setIdLote(Integer idLote) {
    this.idLote = idLote;
}

    

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getStatusAnterior() { return statusAnterior; }
    public void setStatusAnterior(String statusAnterior) {
        this.statusAnterior = statusAnterior;
    }

    public String getStatusNovo() { return statusNovo; }
    public void setStatusNovo(String statusNovo) {
        this.statusNovo = statusNovo;
    }

    public LocalDateTime getDataHora() { return dataHora; }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
