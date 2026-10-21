
package com.example.demo.repository;

import com.example.demo.model.Excecao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExcecaoRepository
        extends JpaRepository<Excecao, Integer> {

    List<Excecao> findByIdLoteOrderByDataHoraDesc(
        Integer idLote);
}
