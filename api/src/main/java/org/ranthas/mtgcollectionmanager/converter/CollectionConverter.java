package org.ranthas.mtgcollectionmanager.converter;

import org.ranthas.mtgcollectionmanager.dto.collection.CardDto;
import org.ranthas.mtgcollectionmanager.dto.collection.CardPrice;
import org.ranthas.mtgcollectionmanager.dto.collection.CardQuantity;
import org.ranthas.mtgcollectionmanager.entity.Card;
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

        return new CardDto(card, manaCost, quantity, price);
    }
}
