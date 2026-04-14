package org.ranthas.mtgcmapi.converter;

import org.ranthas.mtgcmapi.dto.ScryfallCard;
import org.ranthas.mtgcmapi.dto.ScryfallSet;
import org.ranthas.mtgcmapi.entity.MtgCard;
import org.ranthas.mtgcmapi.entity.MtgSet;
import org.springframework.stereotype.Component;

@Component
public class ScryfallConverter {

    public MtgSet convert(ScryfallSet scryfallSet) {

        MtgSet mtgSet = new MtgSet();

        mtgSet.setId(scryfallSet.getId());
        mtgSet.setCode(scryfallSet.getCode());
        mtgSet.setName(scryfallSet.getName());
        mtgSet.setType(scryfallSet.getSetType());
        mtgSet.setReleaseDate(scryfallSet.getReleasedAt());
        mtgSet.setTotalCards(scryfallSet.getCardCount());
        mtgSet.setIconUri(scryfallSet.getIconSvgUri());

        return mtgSet;
    }

    public MtgCard convert(ScryfallCard scryfallCard) {

        MtgCard mtgCard = new MtgCard();

        mtgCard.setId(scryfallCard.getId());
        mtgCard.setName(scryfallCard.getName());
        mtgCard.setType(scryfallCard.getTypeLine());
        mtgCard.setRarity(scryfallCard.getRarity());
        mtgCard.setManaCost(scryfallCard.getManaCost());
        mtgCard.setCollectionNumber(scryfallCard.getCollectionNumber());
        mtgCard.setImageUri(scryfallCard.getImages().getNormal());
        mtgCard.setRegularPrice(scryfallCard.getPrices().getEur());
        mtgCard.setFoilPrice(scryfallCard.getPrices().getEurFoil());
        mtgCard.setOracleText(scryfallCard.getOracleText());
        mtgCard.setArtist(scryfallCard.getArtist());
        mtgCard.setPower(scryfallCard.getPower());
        mtgCard.setToughness(scryfallCard.getToughness());

        return mtgCard;
    }
}
