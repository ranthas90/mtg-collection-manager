package org.ranthas.mtgcollectionmanager.service;

import org.ranthas.mtgcollectionmanager.converter.CollectionConverter;
import org.ranthas.mtgcollectionmanager.dto.CardDTO;
import org.ranthas.mtgcollectionmanager.dto.SetDTO;
import org.ranthas.mtgcollectionmanager.repository.CardRepository;
import org.ranthas.mtgcollectionmanager.repository.SetRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CollectionService {

    private final SetRepository setRepository;
    private final CardRepository cardRepository;
    private final CollectionConverter collectionConverter;

    public CollectionService(
            SetRepository setRepository,
            CardRepository cardRepository,
            CollectionConverter collectionConverter
    ) {
        this.setRepository = setRepository;
        this.cardRepository = cardRepository;
        this.collectionConverter = collectionConverter;
    }

    public List<SetDTO> findAllSets() {
        return setRepository.findAllWithProgress();
    }

    public SetDTO findSetByCode(String code) {
        return setRepository.findWithProgressByCode(code);
    }

    public List<CardDTO> findSetCardsByCode(String setCode) {
        return cardRepository
                .findAllBySetCode(setCode)
                .stream()
                .map(collectionConverter::convert)
                .toList();
    }

    public CardDTO findCardBySetCodeAndSlug(String setCode, String slug) {
        return collectionConverter.convert(cardRepository.findBySetCodeAndSlug(setCode, slug));
    }
}
