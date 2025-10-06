package org.ranthas.mtgcollectionmanager.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ScryfallCard {

    private UUID id;

    @JsonProperty("scryfall_uri")
    private String scryfallUri;

    @JsonProperty("cardmarket_id")
    private Integer cardmarketId;

    @JsonProperty("mana_cost")
    private String manaCost;

    private String name;

    @JsonProperty("type_line")
    private String typeLine;

    @JsonProperty("collector_number")
    private String collectorNumber;

    private boolean digital;

    @JsonProperty("image_uris")
    private ScryfallCardImage cardImages;

    @JsonProperty("prices")
    private ScryfallCardPrice cardPrices;

    private String rarity;

    public ScryfallCard() {
    }

    public UUID getId() {
        return this.id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getScryfallUri() {
        return scryfallUri;
    }

    public void setScryfallUri(String scryfallUri) {
        this.scryfallUri = scryfallUri;
    }

    public Integer getCardmarketId() {
        return cardmarketId;
    }

    public void setCardmarketId(Integer cardmarketId) {
        this.cardmarketId = cardmarketId;
    }

    public String getManaCost() {
        return manaCost;
    }

    public void setManaCost(String manaCost) {
        this.manaCost = manaCost;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTypeLine() {
        return typeLine;
    }

    public void setTypeLine(String typeLine) {
        this.typeLine = typeLine;
    }

    public String getCollectorNumber() {
        return collectorNumber;
    }

    public void setCollectorNumber(String collectorNumber) {
        this.collectorNumber = collectorNumber;
    }

    public boolean isDigital() {
        return digital;
    }

    public void setDigital(boolean digital) {
        this.digital = digital;
    }

    public ScryfallCardImage getCardImages() {
        return cardImages;
    }

    public void setCardImages(ScryfallCardImage cardImages) {
        this.cardImages = cardImages;
    }

    public ScryfallCardPrice getCardPrices() {
        return cardPrices;
    }

    public void setCardPrices(ScryfallCardPrice cardPrices) {
        this.cardPrices = cardPrices;
    }

    public String getRarity() {
        return rarity;
    }

    public void setRarity(String rarity) {
        this.rarity = rarity;
    }
}
