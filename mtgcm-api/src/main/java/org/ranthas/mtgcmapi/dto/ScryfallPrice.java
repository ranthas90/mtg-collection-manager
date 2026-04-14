package org.ranthas.mtgcmapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ScryfallPrice {

    private Double eur;

    @JsonProperty(value = "eur_foil")
    private Double eurFoil;

    public ScryfallPrice() {
    }

    public Double getEur() {
        return eur;
    }

    public void setEur(Double eur) {
        this.eur = eur;
    }

    public Double getEurFoil() {
        return eurFoil;
    }

    public void setEurFoil(Double eurFoil) {
        this.eurFoil = eurFoil;
    }
}
