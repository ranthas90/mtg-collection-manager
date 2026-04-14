package org.ranthas.mtgcmapi.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "mtg_cards")
public class MtgCard {

    @Id
    private UUID id;

    private String name;
    private String type;
    private String rarity;

    @Column(name = "mana_cost")
    private String manaCost;

    @Column(name = "collection_number")
    private String collectionNumber;

    @Column(name = "sort_number")
    private Long sortNumber;

    @Column(name = "image_uri")
    private String imageUri;

    @Column(name = "regular_price")
    private Double regularPrice;

    @Column(name = "foil_price")
    private Double foilPrice;

    private boolean collected;

    @Column(name = "oracle_text", length = 1000)
    private String oracleText;

    private String artist;
    private String power;
    private String toughness;

    @ManyToOne
    @JoinColumn(name = "mtg_set_id")
    private MtgSet mtgSet;

    public MtgCard() {
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public Long getSortNumber() {
        return sortNumber;
    }

    public void setSortNumber(Long sortNumber) {
        this.sortNumber = sortNumber;
    }

    public void setSortNumber(int sortNumber) {
        this.sortNumber = (long) sortNumber;
    }

    public String getImageUri() {
        return imageUri;
    }

    public void setImageUri(String imageUri) {
        this.imageUri = imageUri;
    }

    public Double getRegularPrice() {
        return regularPrice;
    }

    public void setRegularPrice(Double regularPrice) {
        this.regularPrice = regularPrice;
    }

    public Double getFoilPrice() {
        return foilPrice;
    }

    public void setFoilPrice(Double foilPrice) {
        this.foilPrice = foilPrice;
    }

    public boolean isCollected() {
        return collected;
    }

    public void setCollected(boolean collected) {
        this.collected = collected;
    }

    public String getOracleText() {
        return oracleText;
    }

    public void setOracleText(String oracleText) {
        this.oracleText = oracleText;
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

    public MtgSet getMtgSet() {
        return mtgSet;
    }

    public void setMtgSet(MtgSet mtgSet) {
        this.mtgSet = mtgSet;
    }
}
