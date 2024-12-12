package org.ranthas.mtgcollectionmanager.converter;

import org.ranthas.mtgcollectionmanager.dto.collection.*;
import org.ranthas.mtgcollectionmanager.entity.Card;
import org.ranthas.mtgcollectionmanager.entity.Set;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CollectionConverter {

    private final SymbolConverter symbolConverter;

    public CollectionConverter(SymbolConverter symbolConverter) {
        this.symbolConverter = symbolConverter;
    }

    public CardDto convert(Card card) {

        List<String> manaCost = symbolConverter.convert(card.getManaCost());
        CardQuantity quantity = new CardQuantity(card.getNonFoilQuantity(), card.getFoilQuantity());
        CardPrice price = new CardPrice(card.getNonFoilPrice(), card.getFoilPrice());

        return new CardDto(card.getId(), card.getName(), card.getScryfallUri(), card.getRarity(), card.getTypeLine(),
                card.getCollectorNumber(), card.getNumericCollectorNumber(), manaCost, quantity, price,
                card.getImage());
    }
}
