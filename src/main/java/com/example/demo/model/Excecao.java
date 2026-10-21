
package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "excecoes")
public class Excecao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_excecao")
    private Integer idExcecao;

    @Column(name = "id_lote", nullable = false)
    private Integer idLote;

    @Column(name = "id_item")
    private Integer idItem;

    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario;

    @Column(name = "tipo_problema", nullable = false)
    private String tipoProblema;

    @Column(name = "quantidade_afetada", nullable = false)
    private Integer quantidadeAfetada = 0;

    @Column(name = "descricao", nullable = false,
            columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @PrePersist
    public void preparar() {
        if (dataHora == null) {
            dataHora = LocalDateTime.now();
        }

        if (quantidadeAfetada == null) {
            quantidadeAfetada = 0;
        }
    }

    public Integer getIdExcecao() {
        return idExcecao;
    }

    public Integer getIdLote() {
        return idLote;
    }

    public void setIdLote(Integer idLote) {
        this.idLote = idLote;
    }

    public Integer getIdItem() {
        return idItem;
    }

    public void setIdItem(Integer idItem) {
        this.idItem = idItem;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getTipoProblema() {
        return tipoProblema;
    }

    public void setTipoProblema(String tipoProblema) {
        this.tipoProblema = tipoProblema;
    }

    public Integer getQuantidadeAfetada() {
        return quantidadeAfetada;
    }

    public void setQuantidadeAfetada(Integer quantidadeAfetada) {
        this.quantidadeAfetada = quantidadeAfetada;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }
}
