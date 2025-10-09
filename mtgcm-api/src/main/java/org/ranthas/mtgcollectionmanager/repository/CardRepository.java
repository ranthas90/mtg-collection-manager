package org.ranthas.mtgcollectionmanager.repository;

import org.ranthas.mtgcollectionmanager.entity.MtgCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface CardRepository extends JpaRepository<MtgCard, UUID> {

    @Modifying
    @Query("delete from MtgCard c where c.mtgSet.code = ?1")
    int deleteBySetCode(String setCode);

    @Query("from MtgCard c where c.mtgSet.code = ?1 order by c.numericCollectorNumber")
    List<MtgCard> findAllBySetCode(String setCode);

    @Query("from MtgCard c where c.mtgSet.code = ?1 and c.slug = ?2")
    MtgCard findBySetCodeAndSlug(String setCode, String slug);
}
