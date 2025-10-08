package org.ranthas.mtgcollectionmanager.dto;

import java.util.List;

public class CardDTO {

    private final String name;
    private final String rarity;
    private final String typeLine;
    private final List<ManaCost> manaCost;
    private final CollectorNumber collectorNumber;
    private final Double price;
    private final String slug;
    private final Boolean owned;
    private final Boolean foil;

    public CardDTO(
            String name,
            String rarity,
            String typeLine,
            List<ManaCost> manaCost,
            String collectorNumber,
            Long numericCollectorNumber,
            Double price,
            String slug,
            Boolean owned,
            Boolean foil
    ) {
        this.name = name;
        this.rarity = rarity;
        this.typeLine = typeLine;
        this.manaCost = manaCost;
        this.collectorNumber = new CollectorNumber(collectorNumber, numericCollectorNumber);
        this.price = price;
        this.slug = slug;
        this.owned = owned;
        this.foil = foil;
    }

    public String getName() {
        return name;
    }

    public String getRarity() {
        return rarity;
    }

    public String getTypeLine() {
        return typeLine;
    }

    public List<ManaCost> getManaCost() {
        return manaCost;
    }

    public CollectorNumber getCollectorNumber() {
        return collectorNumber;
    }

    public Double getPrice() {
        return price;
    }

    public String getSlug() {
        return slug;
    }

    public Boolean getOwned() {
        return owned;
    }

    public Boolean getFoil() {
        return foil;
    }
}
