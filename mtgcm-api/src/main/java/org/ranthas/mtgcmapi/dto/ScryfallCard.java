package org.ranthas.mtgcmapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ScryfallCard {

    private UUID id;
    private String name;

    @JsonProperty(value = "type_line")
    private String typeLine;

    private String rarity;

    @JsonProperty(value = "mana_cost")
    private String manaCost;

    @JsonProperty(value = "collector_number")
    private String collectionNumber;

    @JsonProperty(value = "image_uris")
    private ScryfallImage images;

    private ScryfallPrice prices;
    private String artist;
    private String power;
    private String toughness;

    @JsonProperty(value = "oracle_text")
    private String oracleText;

    public ScryfallCard() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public String getRarity() {
        return rarity;
    }

    public void setRarity(String rarity) {
        this.rarity = rarity;
    }

    public String getManaCost() {
        return manaCost;
    }

    public void setManaCost(String manaCost) {
        this.manaCost = manaCost;
    }

    public String getCollectionNumber() {
        return collectionNumber;
    }

    public void setCollectionNumber(String collectionNumber) {
        this.collectionNumber = collectionNumber;
    }

    public ScryfallImage getImages() {
        return images;
    }

    public void setImages(ScryfallImage images) {
        this.images = images;
    }

    public ScryfallPrice getPrices() {
        return prices;
    }

    public void setPrices(ScryfallPrice prices) {
        this.prices = prices;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getPower() {
        return power;
    }

    public void setPower(String power) {
        this.power = power;
    }

    public String getToughness() {
        return toughness;
    }

    public void setToughness(String toughness) {
        this.toughness = toughness;
    }

    public String getOracleText() {
        return oracleText;
    }

    public void setOracleText(String oracleText) {
        this.oracleText = oracleText;
    }
}
