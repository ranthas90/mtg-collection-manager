package org.ranthas.mtgcmapi.repository;

import org.ranthas.mtgcmapi.entity.MtgCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MtgCardRepository extends JpaRepository<MtgCard, UUID> {
}
