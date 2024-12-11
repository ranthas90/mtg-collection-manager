package org.ranthas.mtgcollectionmanager.service;

import org.ranthas.mtgcollectionmanager.entity.Card;
import org.ranthas.mtgcollectionmanager.entity.Set;
import org.ranthas.mtgcollectionmanager.repository.CardRepository;
import org.ranthas.mtgcollectionmanager.repository.SetRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CollectionService {

    private final SetRepository setRepository;
    private final CardRepository cardRepository;

    public CollectionService(SetRepository setRepository, CardRepository cardRepository) {
        this.setRepository = setRepository;
        this.cardRepository = cardRepository;
    }

    public List<Set> findAllSets() {
        return setRepository.findAll(Sort.by(Direction.DESC, "releaseDate"));
    }

    public Set findSetById(UUID id) {
        return setRepository.findById(id).get();
    }

    public double calculateSetPrice(UUID setId) {
        return 0.0d;
    }

    public List<Card> findSetCards(UUID setId) {
        return cardRepository.findAllBySetId(setId);
    }

    public Card saveCard(Card card) {
        return cardRepository.save(card);
    }

    public Card findCardById(UUID id) {
        return cardRepository.findById(id).get();
    }
}
