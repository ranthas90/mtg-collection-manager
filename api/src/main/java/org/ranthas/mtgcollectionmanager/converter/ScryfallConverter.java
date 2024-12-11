package org.ranthas.mtgcollectionmanager.converter;

import org.ranthas.mtgcollectionmanager.dto.scryfall.*;
import org.ranthas.mtgcollectionmanager.entity.*;
import org.springframework.stereotype.Component;

@Component
public class ScryfallConverter {

    public Set convert(ScryfallSet scryfallSet) {

        Set set = new Set();

        set.setId(scryfallSet.getId());
        set.setCode(scryfallSet.getCode());
        set.setName(scryfallSet.getName());
        set.setTotalCards(scryfallSet.getCardCount());
        set.setOwnedCards(0L);
        set.setIconPath(scryfallSet.getIconPath());
        set.setReleaseDate(scryfallSet.getReleasedAt());
        set.setSetType(scryfallSet.getSetType());

        return set;
    }

    public Card convert(ScryfallCard scryfallCard) {

        Card card = new Card();

        card.setId(scryfallCard.getId());
        card.setScryfallUri(scryfallCard.getScryfallUri());
        card.setCardmarketId(scryfallCard.getCardmarketId());
        card.setName(scryfallCard.getName());
        card.setManaCost(scryfallCard.getManaCost());
        card.setTypeLine(scryfallCard.getTypeLine());
        card.setRarity(scryfallCard.getRarity());
        card.setCollectorNumber(scryfallCard.getCollectorNumber());

        if (scryfallCard.getCardPrices() != null) {
            ScryfallCardPrice cardPrices = scryfallCard.getCardPrices();
            card.setFoilPrice(cardPrices.getEurFoil());
            card.setNonFoilPrice(cardPrices.getEur());
        }

        if (scryfallCard.getCardImages() != null) {
            card.setImage(scryfallCard.getCardImages().getArtCrop());
        }

        return card;
    }

    public Symbol convert(ScryfallSymbol scryfallSymbol) {

        Symbol symbol = new Symbol();

        symbol.setCode(scryfallSymbol.getSymbol());
        symbol.setImagePath(scryfallSymbol.getSvgPath());

        return symbol;
    }
}
