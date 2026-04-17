package org.ranthas.mtgcmapi.converter;

import org.ranthas.mtgcmapi.dto.CardDto;
import org.ranthas.mtgcmapi.dto.SetDto;
import org.ranthas.mtgcmapi.entity.MtgCard;
import org.ranthas.mtgcmapi.entity.MtgSet;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class MtgConverter {

    public SetDto convert(MtgSet mtgSet) {
        String code = mtgSet.getCode();
        String name = mtgSet.getName();
        String type = mtgSet.getType();
        LocalDate releaseDate = mtgSet.getReleaseDate();
        Long totalCards = mtgSet.getTotalCards();
        Long collectedCards = mtgSet.getCollectedCards();

        return new SetDto(code, name, type, releaseDate, totalCards, collectedCards);
    }

    public CardDto convert(MtgCard mtgCard) {
        String id = mtgCard.getId().toString();
        String name = mtgCard.getName();
        String type = mtgCard.getType();
        String rarity = mtgCard.getRarity();
        String manaCost = mtgCard.getManaCost();
        String collectionNumber = mtgCard.getCollectionNumber();
        String imageUriNormal = mtgCard.getImageUriNormal();
        String imageUriArtCrop = mtgCard.getImageUriArtCrop();
        String oracleText = mtgCard.getOracleText();
        Double regularPrice = mtgCard.getRegularPrice();
        Double foilPrice = mtgCard.getFoilPrice();
        boolean collected = mtgCard.isCollected();

        return new CardDto(id, name, type, rarity, manaCost, collectionNumber, imageUriNormal, imageUriArtCrop,
                oracleText, regularPrice, foilPrice, collected);
    }
}
