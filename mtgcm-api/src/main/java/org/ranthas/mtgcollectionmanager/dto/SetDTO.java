package org.ranthas.mtgcollectionmanager.dto;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class SetDTO {

    private final String code;
    private final String name;
    private final String releaseDate;
    private final String setType;
    private final Long totalCards;
    private final Long ownedCards;

    public SetDTO(String code, String name, String releaseDate, String setType, Long totalCards, Long ownedCards) {
        this.code = code;
        this.name = name;
        this.releaseDate = releaseDate;
        this.setType = setType;
        this.totalCards = totalCards;
        this.ownedCards = ownedCards;
    }

    public SetDTO(String code, String name, LocalDate releaseDate, String setType, Long totalCards, Long ownedCards) {
        this.code = code;
        this.name = name;
        this.releaseDate = releaseDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        this.setType = setType;
        this.totalCards = totalCards;
        this.ownedCards = ownedCards;
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

    public Long getTotalCards() {
        return totalCards;
    }

    public Long getOwnedCards() {
        return ownedCards;
    }

    public Double getProgress() {
        return (ownedCards / totalCards) * 100.0D;
    }
}
