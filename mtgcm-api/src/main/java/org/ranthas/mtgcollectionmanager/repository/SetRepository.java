package org.ranthas.mtgcollectionmanager.repository;

import org.ranthas.mtgcollectionmanager.entity.MtgSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface SetRepository extends JpaRepository<MtgSet, UUID> {

    @Modifying
    @Query("delete from MtgSet s where s.code = ?1")
    int deleteByCode(String code);
}
