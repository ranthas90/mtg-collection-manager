package org.ranthas.mtgcollectionmanager.dto;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class SetDTO {

    private final String code;
    private final String name;
    private final String releaseDate;
    private final String setType;
    private final String iconUri;
    private final Long totalCards;
    private final Long ownedCards;
    private final Double totalPrice;
    private final Double ownedPrice;

    public SetDTO(
            String code,
            String name,
            LocalDate releaseDate,
            String setType,
            String iconUri,
            Long totalCards,
            Long ownedCards,
            Double totalPrice,
            Double ownedPrice
    ) {
        this.code = code;
        this.name = name;
        this.releaseDate = releaseDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        this.setType = setType;
        this.iconUri = iconUri;
        this.totalCards = totalCards;
        this.ownedCards = ownedCards;
        this.totalPrice = totalPrice;
        this.ownedPrice = ownedPrice;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public String getSetType() {
        return setType;
    }

    public String getIconUri() {
        return iconUri;
    }

    public Long getTotalCards() {
        return totalCards;
    }

    public Long getOwnedCards() {
        return ownedCards;
    }

    public Double getProgress() {
        return (ownedCards / totalCards) * 100.0D;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public Double getOwnedPrice() {
        return ownedPrice;
    }
}
