package org.ranthas.mtgcmapi.repository;

import org.ranthas.mtgcmapi.entity.MtgSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MtgSetRepository extends JpaRepository<MtgSet, UUID> {

    @Query("from MtgSet s where s.code not in (?1)")
    List<MtgSet> findMissingSets(List<String> setCodes);

    @Query("from MtgSet s where s.code = ?1")
    Optional<MtgSet> findByCode(String code);
}

