
package com.example.demo.repository;

import com.example.demo.model.Lote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LoteRepository
        extends JpaRepository<Lote, Integer> {

    Optional<Lote> findByCodigoIdentificador(String codigo);
}
