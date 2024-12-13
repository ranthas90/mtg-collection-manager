package org.ranthas.mtgcollectionmanager.dto.collection;

import org.ranthas.mtgcollectionmanager.entity.Card;

import java.util.List;
import java.util.UUID;

public class CardDto {

    private final UUID id;
    private final String name;
    private final String scryfallUri;
    private final String rarity;
    private final String type;
    private final String collectorNumber;
    private final Long numericCollectorNumber;
    private final List<String> manaCost;
    private final CardQuantity quantity;
    private final CardPrice price;
    private final String image;

    public CardDto(Card card, List<String> manaCost, CardQuantity quantity, CardPrice price) {
        id = card.getId();
        name = card.getName();
        scryfallUri = card.getScryfallUri();
        rarity = card.getRarity();
        type = card.getTypeLine();
        collectorNumber = card.getCollectorNumber();
        numericCollectorNumber = card.getNumericCollectorNumber();
        this.manaCost = manaCost;
        this.quantity = quantity;
        this.price = price;
        image = card.getImage();
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getScryfallUri() {
        return scryfallUri;
    }

    public String getRarity() {
        return rarity;
    }

    public String getType() {
        return type;
    }

    public String getCollectorNumber() {
        return collectorNumber;
    }

    public Long getNumericCollectorNumber() {
        return numericCollectorNumber;
    }

    public List<String> getManaCost() {
        return manaCost;
    }

    public CardQuantity getQuantity() {
        return quantity;
    }

    public CardPrice getPrice() {
        return price;
    }

    public String getImage() {
        return image;
    }
}
