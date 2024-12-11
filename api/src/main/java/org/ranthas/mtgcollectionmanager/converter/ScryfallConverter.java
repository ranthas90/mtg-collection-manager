package org.ranthas.mtgcollectionmanager.converter;

import org.ranthas.mtgcollectionmanager.dto.scryfall.*;
import org.ranthas.mtgcollectionmanager.entity.*;
import org.springframework.stereotype.Component;

@Component
public class ScryfallConverter {

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
}
