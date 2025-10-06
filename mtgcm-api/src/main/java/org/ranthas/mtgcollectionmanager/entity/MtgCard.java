package org.ranthas.mtgcollectionmanager.entity;

import jakarta.persistence.*;

import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "cards")
public class MtgCard {

    @Id
    private UUID id;

    @Column(name = "cardmarket_id")
    private Integer cardmarketId;

    @Column(name = "scryfall_uri")
    private String scryfallUri;

    @Column(name = "name")
    private String name;

    @Column(name = "mana_cost")
    private String manaCost;

    @Column(name = "type_line")
    private String typeLine;

    @Column(name = "rarity")
    private String rarity;

    @Column(name = "collector_number")
    private String collectorNumber;

    @Column(name = "numeric_collector_number")
    private Long numericCollectorNumber;

    @Column(name = "non_foil_quantity")
    private long nonFoilQuantity;

    @Column(name = "foil_quantity")
    private long foilQuantity;

    @ManyToOne
    @JoinColumn(name = "set_id")
    private MtgSet mtgSet;

    @Column(name = "image")
    private String image;

    @Column(name = "non_foil_price")
    private Double nonFoilPrice;

    @Column(name = "foil_price")
    private Double foilPrice;

    public MtgCard() {
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
        return this.cardmarketId;
    }

    public void setCardmarketId(Integer cardmarketId) {
        this.cardmarketId = cardmarketId;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getManaCost() {
        return this.manaCost;
    }

    public void setManaCost(String manaCost) {
        this.manaCost = manaCost;
    }

    public String getTypeLine() {
        return this.typeLine;
    }

    public void setTypeLine(String typeLine) {
        this.typeLine = typeLine;
    }

    public String getRarity() {
        return this.rarity;
    }

    public void setRarity(String rarity) {
        this.rarity = rarity;
    }

    public String getCollectorNumber() {
        return this.collectorNumber;
    }

    public void setCollectorNumber(String collectorNumber) {
        this.collectorNumber = collectorNumber;
    }

    public Long getNumericCollectorNumber() {
        return this.numericCollectorNumber;
    }

    public void setNumericCollectorNumber(Long numericCollectorNumber) {
        this.numericCollectorNumber = numericCollectorNumber;
    }

    public long getNonFoilQuantity() {
        return this.nonFoilQuantity;
    }

    public void setNonFoilQuantity(long nonFoilQuantity) {
        this.nonFoilQuantity = nonFoilQuantity;
    }

    public long getFoilQuantity() {
        return this.foilQuantity;
    }

    public void setFoilQuantity(long foilQuantity) {
        this.foilQuantity = foilQuantity;
    }

    public MtgSet getMtgSet() {
        return this.mtgSet;
    }

    public void setMtgSet(MtgSet mtgSet) {
        this.mtgSet = mtgSet;
    }

    public String getImage() {
        return this.image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Double getNonFoilPrice() {
        return this.nonFoilPrice;
    }

    public void setNonFoilPrice(Double nonFoilPrice) {
        this.nonFoilPrice = nonFoilPrice;
    }

    public void setNonFoilPrice(String nonFoilPrice) {
        this.nonFoilPrice = nonFoilPrice == null ? 0.0D : Double.parseDouble(nonFoilPrice);
    }

    public Double getFoilPrice() {
        return this.foilPrice;
    }

    public void setFoilPrice(Double foilPrice) {
        this.foilPrice = foilPrice;
    }

    public void setFoilPrice(String foilPrice) {
        this.foilPrice = foilPrice == null ? 0.0D : Double.parseDouble(foilPrice);
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        MtgCard mtgCard = (MtgCard) o;
        return Objects.equals(id, mtgCard.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
