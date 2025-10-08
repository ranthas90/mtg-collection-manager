package org.ranthas.mtgcollectionmanager.converter;

import org.ranthas.mtgcollectionmanager.dto.CardDTO;
import org.ranthas.mtgcollectionmanager.dto.ManaCost;
import org.ranthas.mtgcollectionmanager.entity.MtgCard;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CollectionConverter {

    private final ManaCostConverter manaCostConverter;

    public CollectionConverter(ManaCostConverter manaCostConverter) {
        this.manaCostConverter = manaCostConverter;
    }

    public CardDTO convert(MtgCard mtgCard) {

        String name = mtgCard.getName();
        String rarity = mtgCard.getRarity();
        String typeLine = mtgCard.getTypeLine();
        String collectorNumber = mtgCard.getCollectorNumber();
        Long numericCollectorNumber = mtgCard.getNumericCollectorNumber();
        Double price = mtgCard.getNormalPrice();
        String slug = mtgCard.getSlug();
        boolean owned = mtgCard.isOwned();
        boolean foil = mtgCard.isFoil();
        List<ManaCost> manaCost = manaCostConverter.convert(mtgCard.getManaCost());

        if (mtgCard.isOwned() && mtgCard.isFoil()) {
            price = mtgCard.getFoilPrice();
        }

        return new CardDTO(name, rarity, typeLine, manaCost, collectorNumber, numericCollectorNumber, price, slug, owned, foil);
    }
}
