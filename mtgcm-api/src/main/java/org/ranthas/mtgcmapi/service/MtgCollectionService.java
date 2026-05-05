package org.ranthas.mtgcmapi.service;

import org.ranthas.mtgcmapi.dto.UpdateSetCard;
import org.ranthas.mtgcmapi.entity.MtgCard;
import org.ranthas.mtgcmapi.entity.MtgSet;
import org.ranthas.mtgcmapi.repository.MtgCardRepository;
import org.ranthas.mtgcmapi.repository.MtgSetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MtgCollectionService {

    private final MtgSetRepository mtgSetRepository;
    private final MtgCardRepository mtgCardRepository;

    public MtgCollectionService(MtgSetRepository mtgSetRepository, MtgCardRepository mtgCardRepository) {
        this.mtgSetRepository = mtgSetRepository;
        this.mtgCardRepository = mtgCardRepository;
    }

    public List<MtgSet> findAllSets() {
        return mtgSetRepository.findAll();
    }

    public List<MtgCard> findAllSetCards(String setCode) {
        return mtgCardRepository.findAllBySetCode(setCode);
    }

    public MtgCard updateSetCard(UUID cardId, UpdateSetCard request) {
        MtgCard mtgCard = mtgCardRepository.getReferenceById(cardId);
        mtgCard.setCollected(request.collected());

        return mtgCardRepository.save(mtgCard);
    }
}
