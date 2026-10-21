
package com.example.demo.service;

import com.example.demo.model.Lote;
import com.example.demo.model.Movimentacao;
import com.example.demo.model.Excecao;

import com.example.demo.repository.LoteRepository;
import com.example.demo.repository.MovimentacaoRepository;
import com.example.demo.repository.ExcecaoRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LoteService {

    private final LoteRepository lotes;
    private final MovimentacaoRepository movimentacoes;
    private final ExcecaoRepository excecoes;

    public LoteService(
            LoteRepository lotes,
            MovimentacaoRepository movimentacoes,
            ExcecaoRepository excecoes) {
        this.lotes = lotes;
        this.movimentacoes = movimentacoes;
        this.excecoes = excecoes;
    }

    @Transactional
    public Lote cadastrar(Lote lote) {
        if (lote.getNumeroOp() == null
                || lote.getNumeroOp().isBlank()) {
            throw new IllegalArgumentException(
                "Informe o número da ordem de produção");
        }

        if (lote.getTipoServico() == null
                || lote.getTipoServico().isBlank()) {
            throw new IllegalArgumentException(
                "Informe o tipo de serviço");
        }

        if (lote.getQuantidadeTotal() == null
                || lote.getQuantidadeTotal() <= 0) {
            throw new IllegalArgumentException(
                "A quantidade total deve ser maior que zero");
        }

        if (lote.getIdBanca() == null
                || lote.getIdModelo() == null) {
            throw new IllegalArgumentException(
                "Informe a banca e o modelo do calçado");
        }

        lote.setStatusAtual("Criado");
        lote.setQuantidadeAprovada(0);

        return lotes.save(lote);
    }

    @Transactional
    public Lote movimentar(
            String codigo,
            String tipo,
            Integer idUsuario) {

        if (tipo == null || idUsuario == null) {
            throw new IllegalArgumentException(
                "Tipo de movimentação e usuário são obrigatórios");
        }

        Lote lote = lotes.findByCodigoIdentificador(codigo)
            .orElseThrow(() -> new IllegalArgumentException(
                "Lote não encontrado"));

        String anterior = lote.getStatusAtual();
        String novo;

        switch (tipo.toUpperCase()) {
            case "ENVIO":
                exigirStatus(anterior, "Criado");
                novo = "Enviado";
                break;

            case "RECEBIMENTO":
                exigirStatus(anterior, "Enviado");
                novo = "Em processamento";
                break;

            case "RETORNO":
                exigirStatus(anterior, "Em processamento");
                novo = "Concluído";
                break;

            default:
                throw new IllegalArgumentException(
                    "Tipo inválido: use ENVIO, RECEBIMENTO ou RETORNO");
        }

        lote.setStatusAtual(novo);
        Lote salvo = lotes.save(lote);

        Movimentacao mov = new Movimentacao();
        mov.setIdLote(salvo.getIdLote());
        mov.setIdUsuario(idUsuario);
        mov.setStatusAnterior(anterior);
        mov.setStatusNovo(novo);
        mov.setObservacao("Movimentação: " + tipo.toUpperCase());

        movimentacoes.save(mov);

        return salvo;
    }

    @Transactional
    public Excecao registrarPerdas(
            String codigo,
            Integer idUsuario,
            Integer quantidade,
            String descricao) {

        if (quantidade == null || quantidade <= 0) {
            throw new IllegalArgumentException(
                "A quantidade afetada deve ser maior que zero");
        }

        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException(
                "Informe a descrição da ocorrência");
        }

        Lote lote = lotes.findByCodigoIdentificador(codigo)
            .orElseThrow(() -> new IllegalArgumentException(
                "Lote não encontrado"));

        exigirStatus(
            lote.getStatusAtual(), "Em processamento");

        Excecao excecao = new Excecao();
        excecao.setIdLote(lote.getIdLote());
        excecao.setIdUsuario(idUsuario);
        excecao.setTipoProblema("PERDA");
        excecao.setQuantidadeAfetada(quantidade);
        excecao.setDescricao(descricao);

        return excecoes.save(excecao);
    }


    public List<Movimentacao> historico(Integer idLote) {
        return movimentacoes
            .findByIdLoteOrderByDataHoraDesc(idLote);
    }
    
    public List<Excecao> listarExcecoes(Integer idLote) {
        return excecoes
            .findByIdLoteOrderByDataHoraDesc(idLote);
    }
    

    private void exigirStatus(
            String atual, String esperado) {

        if (!esperado.equals(atual)) {
            throw new IllegalStateException(
                "Status inválido. Esperado: " + esperado
                + "; atual: " + atual);
        }
    }
}
