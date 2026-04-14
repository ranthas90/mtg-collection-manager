package org.ranthas.mtgcmapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ScryfallSet {

    private UUID id;
    private String code;
    private String name;

    @JsonProperty(value = "set_type")
    private String setType;

    @JsonProperty(value = "released_at")
    private LocalDate releasedAt;

    @JsonProperty(value = "card_count")
    private Long cardCount;

    private Boolean digital;

    @JsonProperty(value = "icon_svg_uri")
    private String iconSvgUri;

    public ScryfallSet() {
    }

    public UUID getId() {
        return id;
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

    public String getSetType() {
        return setType;
    }

    public void setSetType(String setType) {
        this.setType = setType;
    }

    public LocalDate getReleasedAt() {
        return releasedAt;
    }

    public void setReleasedAt(LocalDate releasedAt) {
        this.releasedAt = releasedAt;
    }

    public Long getCardCount() {
        return cardCount;
    }

    public void setCardCount(Long cardCount) {
        this.cardCount = cardCount;
    }

    public Boolean getDigital() {
        return digital;
    }

    public void setDigital(Boolean digital) {
        this.digital = digital;
    }

    public String getIconSvgUri() {
        return iconSvgUri;
    }

    public void setIconSvgUri(String iconSvgUri) {
        this.iconSvgUri = iconSvgUri;
    }

    public boolean isValid() {
        return releasedAt != null &&
                LocalDate.now().isAfter(releasedAt) &&
                !digital;
    }
}
