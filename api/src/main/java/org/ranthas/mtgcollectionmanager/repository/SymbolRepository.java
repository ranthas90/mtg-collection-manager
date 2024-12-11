package org.ranthas.mtgcollectionmanager.repository;

import org.ranthas.mtgcollectionmanager.entity.Symbol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface SymbolRepository extends JpaRepository<Symbol, UUID> {

    @Query("from Symbol where code = ?1")
    Symbol findByCode(String symbol);
    
}
