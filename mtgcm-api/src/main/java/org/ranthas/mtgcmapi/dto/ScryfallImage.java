package org.ranthas.mtgcmapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ScryfallImage {

    @JsonProperty(value = "art_crop")
    private String artCrop;

    private String normal;

    public ScryfallImage() {
    }

    public String getArtCrop() {
        return artCrop;
    }

    public void setArtCrop(String artCrop) {
        this.artCrop = artCrop;
    }

    public String getNormal() {
        return normal;
    }

    public void setNormal(String normal) {
        this.normal = normal;
    }
}
