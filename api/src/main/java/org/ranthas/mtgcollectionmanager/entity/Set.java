package org.ranthas.mtgcollectionmanager.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.ranthas.mtgcollectionmanager.constant.DateTimeConstants;
import org.ranthas.mtgcollectionmanager.dto.scryfall.ScryfallSet;

import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "sets")
public class Set {

    @Id
    private UUID id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "release_date")
    @JsonFormat(pattern = DateTimeConstants.DATE_PATTERN)
    private LocalDate releaseDate;

    @Column(name = "total_cards")
    private long totalCards;

    @Column(name = "owned_cards")
    private long ownedCards;

    @Column(name = "icon_path")
    private String iconPath;

    @Column(name = "set_type")
    private String setType;

    @Column(name = "price")
    private Double price;

    @Column(name = "foil_price")
    private Double foilPrice;

    public Set() {
    }

    public Set(ScryfallSet scryfallSet, String setPath) {
        id = scryfallSet.getId();
        code = scryfallSet.getCode();
        name = scryfallSet.getName();
        totalCards = scryfallSet.getCardCount();
        ownedCards = 0L;
        iconPath = setPath;
        releaseDate = LocalDate.parse(scryfallSet.getReleasedAt(), DateTimeConstants.DATE_FORMATTER);
        setType = scryfallSet.getSetType().replace("_", " ");
    }

    public UUID getId() {
        return this.id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = LocalDate.parse(releaseDate, DateTimeConstants.DATE_FORMATTER);
    }

    public String getIconPath() {
        return iconPath;
    }

    public void setIconPath(String iconPath) {
        this.iconPath = iconPath;
    }

    public String getSetType() {
        return this.setType;
    }

    public void setSetType(String setType) {
        this.setType = setType;
    }

    public long getTotalCards() {
        return totalCards;
    }

    public void setTotalCards(long totalCards) {
        this.totalCards = totalCards;
    }

    public long getOwnedCards() {
        return ownedCards;
    }

    public void setOwnedCards(long ownedCards) {
        this.ownedCards = ownedCards;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getFoilPrice() {
        return foilPrice;
    }

    public void setFoilPrice(Double foilPrice) {
        this.foilPrice = foilPrice;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Set set = (Set) o;
        return Objects.equals(id, set.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Set{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", releaseDate=" + releaseDate +
                ", totalCards=" + totalCards +
                ", ownedCards=" + ownedCards +
                ", iconPath='" + iconPath + '\'' +
                ", setType='" + setType + '\'' +
                ", price=" + price +
                ", foilPrice=" + foilPrice +
                '}';
    }
}
