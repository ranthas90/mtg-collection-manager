package org.ranthas.mtgcollectionmanager.repository;

import org.ranthas.mtgcollectionmanager.dto.SetDTO;
import org.ranthas.mtgcollectionmanager.entity.MtgSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface SetRepository extends JpaRepository<MtgSet, UUID> {

    @Modifying
    @Query("delete from MtgSet s where s.code = ?1")
    int deleteByCode(String code);

    @Query("""
            select new org.ranthas.mtgcollectionmanager.dto.SetDTO(
            set.code,set.name,set.releaseDate,set.setType,set.iconPath as iconUri,set.totalCards,
            (select count(*) from MtgCard card where card.mtgSet = set and card.owned = true) as ownedCards,
            totalPrice,
            (select coalesce(sum(coalesce(normalPrice,0.0)),0.0) from MtgCard card where card.mtgSet = set and card.owned = true) as ownedPrice
            )
            from MtgSet set
            order by set.releaseDate desc
            """
    )
    List<SetDTO> findAllWithProgress();

    @Query("""
            select new org.ranthas.mtgcollectionmanager.dto.SetDTO(
            set.code,set.name,set.releaseDate,set.setType,set.iconPath as iconUri,set.totalCards,
            (select count(*) from MtgCard card where card.mtgSet = set and card.owned = true) as ownedCards,
            totalPrice,
            (select coalesce(sum(coalesce(normalPrice,0.0)),0.0) from MtgCard card where card.mtgSet = set and card.owned = true) as ownedPrice
            )
            from MtgSet set
            where set.code = ?1
            order by set.releaseDate desc
            """
    )
    SetDTO findWithProgressByCode(String code);
}
