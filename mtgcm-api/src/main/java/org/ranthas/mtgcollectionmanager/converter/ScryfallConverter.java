package org.ranthas.mtgcollectionmanager.converter;

import org.ranthas.mtgcollectionmanager.dto.ScryfallCard;
import org.ranthas.mtgcollectionmanager.dto.ScryfallSet;
import org.ranthas.mtgcollectionmanager.dto.ScryfallSymbol;
import org.ranthas.mtgcollectionmanager.entity.MtgCard;
import org.ranthas.mtgcollectionmanager.entity.MtgSet;
import org.ranthas.mtgcollectionmanager.entity.MtgSymbol;
import org.springframework.stereotype.Component;

@Component
public class ScryfallConverter {

    public MtgSymbol convert(ScryfallSymbol symbol) {

        MtgSymbol mtgSymbol = new MtgSymbol();
        mtgSymbol.setCode(symbol.getCode());
        mtgSymbol.setSymbol(symbol.getSymbol());
        mtgSymbol.setImagePath(symbol.getSvgPath());

        return mtgSymbol;
    }

    public MtgSet convert(ScryfallSet set) {

        MtgSet mtgSet = new MtgSet();
        mtgSet.setId(set.getId());
        mtgSet.setCode(set.getCode());
        mtgSet.setName(set.getName());
        mtgSet.setReleaseDate(set.getReleasedAt());
        mtgSet.setTotalCards(set.getCardCount());
        mtgSet.setSetType(set.getSetType());
        mtgSet.setIconPath(set.getIconPath());

        return mtgSet;
    }

    public MtgCard convert(ScryfallCard card, MtgSet mtgSet, long collectionOrder) {

        MtgCard mtgCard = new MtgCard();
        mtgCard.setId(card.getId());
        mtgCard.setScryfallUri(card.getScryfallUri());
        mtgCard.setCardmarketId(card.getCardmarketId());
        mtgCard.setName(card.getName());
        mtgCard.setManaCost(card.getManaCost());
        mtgCard.setTypeLine(card.getTypeLine());
        mtgCard.setRarity(card.getRarity());
        mtgCard.setCollectorNumber(card.getCollectorNumber());
        mtgCard.setOwned(false);
        mtgCard.setFoil(false);
        mtgCard.setMtgSet(mtgSet);
        mtgCard.setNumericCollectorNumber(collectionOrder);

        if (card.getCardPrices() != null) {
            mtgCard.setNormalPrice(card.getCardPrices().getEur());
            mtgCard.setFoilPrice(card.getCardPrices().getEurFoil());
        }

        if (card.getCardImages() != null) {
            mtgCard.setImage(card.getCardImages().getArtCrop());
        }

        String slug = collectionOrder + "-" + card.getName()
                .toLowerCase()
                .replace(" ", "-")
                .replace("'", "");

        mtgCard.setSlug(slug);

        return mtgCard;
    }
}
