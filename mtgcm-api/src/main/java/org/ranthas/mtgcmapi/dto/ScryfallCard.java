package org.ranthas.mtgcmapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ScryfallCard {

    private String id;
    private String name;

    @JsonProperty(value = "type_line")
    private String typeLine;

    private String rarity;

    @JsonProperty(value = "mana_cost")
    private String manaCost;

    @JsonProperty(value = "collection_number")
    private String collectionNumber;
}
