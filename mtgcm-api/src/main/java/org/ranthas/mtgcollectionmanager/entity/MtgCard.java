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

    @Column(name = "is_owned")
    private boolean owned;

    @Column(name = "is_foil")
    private boolean foil;

    @ManyToOne
    @JoinColumn(name = "set_id")
    private MtgSet mtgSet;

    @Column(name = "image")
    private String image;

    @Column(name = "normal_price")
    private Double normalPrice;

    @Column(name = "foil_price")
    private Double foilPrice;

    @Column(name = "slug")
    private String slug;

    public MtgCard() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Integer getCardmarketId() {
        return cardmarketId;
    }

    public void setCardmarketId(Integer cardmarketId) {
        this.cardmarketId = cardmarketId;
    }

    public String getScryfallUri() {
        return scryfallUri;
    }

    public void setScryfallUri(String scryfallUri) {
        this.scryfallUri = scryfallUri;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getManaCost() {
        return manaCost;
    }

    public void setManaCost(String manaCost) {
        this.manaCost = manaCost;
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

    public String getCollectorNumber() {
        return collectorNumber;
    }

    public void setCollectorNumber(String collectorNumber) {
        this.collectorNumber = collectorNumber;
    }

    public Long getNumericCollectorNumber() {
        return numericCollectorNumber;
    }

    public void setNumericCollectorNumber(Long numericCollectorNumber) {
        this.numericCollectorNumber = numericCollectorNumber;
    }

    public boolean isOwned() {
        return owned;
    }

    public void setOwned(boolean owned) {
        this.owned = owned;
    }

    public boolean isFoil() {
        return foil;
    }

    public void setFoil(boolean foil) {
        this.foil = foil;
    }

    public MtgSet getMtgSet() {
        return mtgSet;
    }

    public void setMtgSet(MtgSet mtgSet) {
        this.mtgSet = mtgSet;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Double getNormalPrice() {
        return normalPrice;
    }

    public void setNormalPrice(Double normalPrice) {
        this.normalPrice = normalPrice;
    }

    public void setNormalPrice(String normalPrice) {
        this.normalPrice = normalPrice == null ? 0.0D : Double.parseDouble(normalPrice);
    }

    public Double getFoilPrice() {
        return foilPrice;
    }

    public void setFoilPrice(Double foilPrice) {
        this.foilPrice = foilPrice;
    }

    public void setFoilPrice(String foilPrice) {
        this.foilPrice = foilPrice == null ? 0.0D : Double.parseDouble(foilPrice);
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
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
