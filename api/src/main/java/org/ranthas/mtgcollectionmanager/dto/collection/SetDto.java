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

    public SetDto(Set set) {
        this.id = set.getId();
        this.code = set.getCode();
        this.name = set.getName();
        this.iconPath = set.getIconPath();
        this.totalCards = set.getTotalCards();
        this.ownedCards = set.getOwnedCards();
        this.releasedAt = set.getReleaseDate();
        this.setType = set.getSetType();
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
}
