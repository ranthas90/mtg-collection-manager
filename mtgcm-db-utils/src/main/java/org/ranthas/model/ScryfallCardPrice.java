package org.ranthas.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ScryfallCardPrice {

    @JsonProperty("eur")
    private String eur;

    @JsonProperty("eur_foil")
    private String eurFoil;

    public ScryfallCardPrice() {
    }

    public String getEur() {
        return eur;
    }

    public void setEur(String eur) {
        this.eur = eur;
    }

    public String getEurFoil() {
        return eurFoil;
    }

    public void setEurFoil(String eurFoil) {
        this.eurFoil = eurFoil;
    }
}
