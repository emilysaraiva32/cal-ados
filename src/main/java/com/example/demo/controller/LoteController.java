
package com.example.demo.controller;

import com.example.demo.model.Lote;
import com.example.demo.model.Movimentacao;
import com.example.demo.model.Excecao;

import com.example.demo.repository.LoteRepository;
import com.example.demo.service.LoteService;
import com.example.demo.service.QrCodeService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lotes")
@CrossOrigin(origins = "http://localhost:5173")
public class LoteController {

    private final LoteService service;
    private final LoteRepository lotes;
    private final QrCodeService qrCode;

    public LoteController(
            LoteService service,
            LoteRepository lotes,
            QrCodeService qrCode) {
        this.service = service;
        this.lotes = lotes;
        this.qrCode = qrCode;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Lote cadastrar(@RequestBody Lote lote) {
        return service.cadastrar(lote);
    }

    @GetMapping
    public List<Lote> listar() {
        return lotes.findAll();
    }

    @GetMapping("/{id}")
    public Lote buscar(@PathVariable Integer id) {
        return lotes.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Lote não encontrado"));
    }

    @GetMapping("/codigo/{codigo}/qrcode")
    public Map<String, String> gerarQrCode(
            @PathVariable String codigo) {

        lotes.findByCodigoIdentificador(codigo)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Lote não encontrado"));

        try {
            return Map.of(
                "codigo", codigo,
                "imagemBase64", qrCode.gerar(codigo)
            );
        } catch (Exception e) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Erro ao gerar QR Code");
        }
    }

    @PostMapping("/movimentar")
    public Lote movimentar(
            @RequestBody Map<String, Object> dados) {

        return service.movimentar(
            (String) dados.get("codigo"),
            (String) dados.get("tipo"),
            converterIdUsuario(dados.get("idUsuario"))
        );
    }

    @PostMapping("/perdas")
    public Excecao registrarPerdas(
            @RequestBody Map<String, Object> dados) {

        Object quantidade = dados.get("quantidade");

        if (!(quantidade instanceof Number)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Informe a quantidade afetada");
        }

        return service.registrarPerdas(
            (String) dados.get("codigo"),
            converterIdUsuario(dados.get("idUsuario")),
            ((Number) quantidade).intValue(),
            (String) dados.get("descricao")
        );
    }

    @GetMapping("/{id}/historico")
    public List<Movimentacao> historico(
            @PathVariable Integer id) {
        buscar(id);
        return service.historico(id);
    }

    @GetMapping("/{id}/excecoes")
    public List<Excecao> excecoes(
            @PathVariable Integer id) {
        buscar(id);
        return service.listarExcecoes(id);
    }

    private Integer converterIdUsuario(Object valor) {
        if (!(valor instanceof Number)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Informe um ID de usuário válido");
        }

        return ((Number) valor).intValue();
    }
}
