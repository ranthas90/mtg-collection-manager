package org.ranthas.mtgcollectionmanager.dto.collection;

import org.ranthas.mtgcollectionmanager.entity.Set;

import java.time.LocalDate;
import java.util.UUID;

public class SetDto {

    private final UUID id;
    private final String code;
    private final String name;
    private final String iconPath;
    private final long totalCards;
    private final long ownedCards;
    private final LocalDate releasedAt;
    private final String setType;
    private final Double collectionPrice;

    public SetDto(Set set) {
        id = set.getId();
        code = set.getCode();
        name = set.getName();
        iconPath = "/assets/sets/" + set.getIconPath();
        totalCards = set.getTotalCards();
        ownedCards = set.getOwnedCards();
        releasedAt = set.getReleaseDate();
        setType = set.getSetType();
        collectionPrice = set.getPrice();
    }

    public UUID getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getIconPath() {
        return iconPath;
    }

    public long getTotalCards() {
        return totalCards;
    }

    public long getOwnedCards() {
        return ownedCards;
    }

    public LocalDate getReleasedAt() {
        return releasedAt;
    }

    public String getSetType() {
        return setType;
    }

    public Double getCollectionPrice() {
        return collectionPrice;
    }
}
