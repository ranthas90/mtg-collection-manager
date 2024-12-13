package org.ranthas.mtgcollectionmanager.entity;

import jakarta.persistence.*;
import org.ranthas.mtgcollectionmanager.dto.scryfall.ScryfallCard;
import org.ranthas.mtgcollectionmanager.dto.scryfall.ScryfallCardPrice;

import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "cards")
public class Card {

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
    private Set mtgSet;

    @Column(name = "image")
    private String image;

    @Column(name = "non_foil_price")
    private Double nonFoilPrice;

    @Column(name = "foil_price")
    private Double foilPrice;

    public Card() {
    }

    public Card(ScryfallCard scryfallCard, Set set, long cardIndex) {
        id = scryfallCard.getId();
        scryfallUri = scryfallCard.getScryfallUri();
        cardmarketId = scryfallCard.getCardmarketId();
        name = scryfallCard.getName();
        manaCost = scryfallCard.getManaCost();
        typeLine = scryfallCard.getTypeLine();
        rarity = scryfallCard.getRarity();
        collectorNumber = scryfallCard.getCollectorNumber();

        if (scryfallCard.getCardPrices() != null) {
            ScryfallCardPrice cardPrices = scryfallCard.getCardPrices();
            foilPrice = cardPrices.getEurFoil() == null ? 0.0D : Double.parseDouble(cardPrices.getEurFoil());
            nonFoilPrice = cardPrices.getEur() == null ? 0.0D : Double.parseDouble(cardPrices.getEur());
        }

        if (scryfallCard.getCardImages() != null) {
            image = scryfallCard.getCardImages().getArtCrop();
        }

        mtgSet = set;
        numericCollectorNumber = cardIndex;
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

    public Set getMtgSet() {
        return this.mtgSet;
    }

    public void setMtgSet(Set mtgSet) {
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

    public Double getFoilPrice() {
        return this.foilPrice;
    }

    public void setFoilPrice(Double foilPrice) {
        this.foilPrice = foilPrice;
    }

    @Override
    public boolean equals(Object o) {
        return id.equals(((Card) o).getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "{" +
                " id='" + getId() + "'" +
                ", cardmarketId='" + getCardmarketId() + "'" +
                ", name='" + getName() + "'" +
                ", manaCost='" + getManaCost() + "'" +
                ", typeLine='" + getTypeLine() + "'" +
                ", rarity='" + getRarity() + "'" +
                ", collectorNumber='" + getCollectorNumber() + "'" +
                ", numericCollectorNumber='" + getNumericCollectorNumber() + "'" +
                ", nonFoilQuantity='" + getNonFoilQuantity() + "'" +
                ", foilQuantity='" + getFoilQuantity() + "'" +
                ", mtgSet='" + getMtgSet() + "'" +
                ", image='" + getImage() + "'" +
                ", nonFoilPrice='" + getNonFoilPrice() + "'" +
                ", foilPrice='" + getFoilPrice() + "'" +
                "}";
    }
}
