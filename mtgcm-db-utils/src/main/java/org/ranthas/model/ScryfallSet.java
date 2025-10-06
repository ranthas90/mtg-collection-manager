package org.ranthas.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ScryfallSet {

    private UUID id;
    private String code;
    private String name;

    @JsonProperty("released_at")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate releasedAt;

    @JsonProperty("card_count")
    private Integer cardCount;

    private boolean digital;

    @JsonProperty("icon_svg_uri")
    private String iconPath;

    @JsonProperty("set_type")
    private String setType;

    @JsonProperty("nonfoil_only")
    private Boolean nonFoilOnly;

    @JsonProperty("foil_only")
    private Boolean foilOnly;

    public ScryfallSet() {
    }

    public UUID getId() {
        return this.id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public boolean getDigital() {
        return this.digital;
    }

    public Boolean isNonFoilOnly() {
        return this.nonFoilOnly;
    }

    public Boolean isFoilOnly() {
        return this.foilOnly;
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

    public LocalDate getReleasedAt() {
        return releasedAt;
    }

    public void setReleasedAt(LocalDate releasedAt) {
        this.releasedAt = releasedAt;
    }

    public Integer getCardCount() {
        return cardCount;
    }

    public void setCardCount(Integer cardCount) {
        this.cardCount = cardCount;
    }

    public boolean isDigital() {
        return digital;
    }

    public void setDigital(boolean digital) {
        this.digital = digital;
    }

    public String getIconPath() {
        return iconPath;
    }

    public void setIconPath(String iconPath) {
        this.iconPath = iconPath;
    }

    public String getSetType() {
        return setType;
    }

    public void setSetType(String setType) {
        this.setType = setType;
    }

    public Boolean getNonFoilOnly() {
        return nonFoilOnly;
    }

    public void setNonFoilOnly(Boolean nonFoilOnly) {
        this.nonFoilOnly = nonFoilOnly;
    }

    public Boolean getFoilOnly() {
        return foilOnly;
    }

    public void setFoilOnly(Boolean foilOnly) {
        this.foilOnly = foilOnly;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ScryfallSet that = (ScryfallSet) o;
        return Objects.equals(code, that.code);
    }

    @Override
    public int hashCode() {
        return Objects.hash(code);
    }

    public boolean isValid() {
        return !digital &&
                cardCount > 0 &&
                releasedAt.isBefore(LocalDate.now());
    }
}
