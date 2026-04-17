package org.ranthas.mtgcmapi.repository;

import org.ranthas.mtgcmapi.entity.MtgCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface MtgCardRepository extends JpaRepository<MtgCard, UUID> {

    @Query("from MtgCard c where c.mtgSet.code = ?1 order by c.sortNumber")
    List<MtgCard> findAllBySetCode(String setCode);
}
