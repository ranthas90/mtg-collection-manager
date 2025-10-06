package org.ranthas.mtgcollectionmanager.service;

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

    public CollectionService(SetRepository setRepository, CardRepository cardRepository) {
        this.setRepository = setRepository;
        this.cardRepository = cardRepository;
    }

    public List<SetDTO> findAllSets() {
        return setRepository
                .findAll(Sort.by(Sort.Direction.DESC, "releaseDate"))
                .stream()
                .map(mtgSet -> new SetDTO(
                        mtgSet.getCode(),
                        mtgSet.getName(),
                        mtgSet.getReleaseDate(),
                        mtgSet.getSetType(),
                        mtgSet.getTotalCards(),
                        0L
                ))
                .toList();
    }

    public List<CardDTO> findSetCardsByCode(String setCode) {
        return cardRepository
                .findAllBySetCode(setCode)
                .stream()
                .map(mtgCard -> new CardDTO(mtgCard.getName()))
                .toList();
    }
}
