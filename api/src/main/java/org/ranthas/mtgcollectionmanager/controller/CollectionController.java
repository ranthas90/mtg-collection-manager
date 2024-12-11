package org.ranthas.mtgcollectionmanager.controller;

import org.ranthas.mtgcollectionmanager.constant.Endpoints;
import org.ranthas.mtgcollectionmanager.converter.CollectionConverter;
import org.ranthas.mtgcollectionmanager.dto.collection.CardDto;
import org.ranthas.mtgcollectionmanager.dto.collection.CardQuantity;
import org.ranthas.mtgcollectionmanager.dto.collection.SetDto;
import org.ranthas.mtgcollectionmanager.entity.Card;
import org.ranthas.mtgcollectionmanager.service.CollectionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
public class CollectionController {

    private final CollectionService collectionService;
    private final CollectionConverter collectionConverter;

    public CollectionController(CollectionService collectionService, CollectionConverter collectionConverter) {
        this.collectionService = collectionService;
        this.collectionConverter = collectionConverter;
    }

    @GetMapping(Endpoints.SETS)
    public List<SetDto> findSets() {
        return collectionService
                .findAllSets()
                .stream()
                .map(collectionConverter::convert)
                .collect(Collectors.toList());
    }

    @GetMapping(Endpoints.SET_BY_ID)
    public SetDto findSetById(@PathVariable UUID id) {
        return collectionConverter.convert(collectionService.findSetById(id));
    }

    @GetMapping(Endpoints.SET_CARDS)
    public List<CardDto> findCardsInSet(@PathVariable UUID id) {
        return collectionService
                .findSetCards(id)
                .stream()
                .map(collectionConverter::convert)
                .collect(Collectors.toList());
    }

    @PutMapping(Endpoints.CARD_BY_ID)
    public CardDto updateQuantity(@PathVariable UUID id, @RequestBody CardQuantity request) {

        Card card = collectionService.findCardById(id);
        card.setNonFoilQuantity(request.nonFoil());
        card.setFoilQuantity(request.foil());

        Card updatedCard = collectionService.saveCard(card);
        return collectionConverter.convert(updatedCard);
    }
}
