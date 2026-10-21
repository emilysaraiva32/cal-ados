
package com.example.demo.controller;

import com.example.demo.model.Lote;
import com.example.demo.repository.LoteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final LoteRepository lotes;

    public DashboardController(LoteRepository lotes) {
        this.lotes = lotes;
    }

    @GetMapping
    public Map<String, Object> resumo() {
        List<Lote> todos = lotes.findAll();

        long criados = contar(todos, "Criado");
        long enviados = contar(todos, "Enviado");
        long processando = contar(todos, "Em processamento");
        long concluidos = contar(todos, "Concluído");

        double mediaHoras = todos.stream()
            .filter(l -> l.getDataCriacao() != null
                && "Concluído".equals(l.getStatusAtual()))
            .mapToLong(l -> {
                // O schema atual não possui uma coluna
                // de data de conclusão em lotes.
                // O tempo real será calculado pelo histórico.
                return 0L;
            })
            .average()
            .orElse(0);

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("totalLotes", todos.size());
        resultado.put("criados", criados);
        resultado.put("enviados", enviados);
        resultado.put("emProcessamento", processando);
        resultado.put("concluidos", concluidos);
        resultado.put("tempoMedioCicloHoras", mediaHoras);

        return resultado;
    }

    private long contar(List<Lote> lista, String status) {
        return lista.stream()
            .filter(l -> status.equals(l.getStatusAtual()))
            .count();
    }
}
