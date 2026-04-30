package org.ranthas.mtgcmapi.service;

import org.ranthas.mtgcmapi.entity.MtgCard;
import org.ranthas.mtgcmapi.entity.MtgSet;
import tools.jackson.core.JacksonException;
import tools.jackson.core.JsonParser;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.deser.std.StdDeserializer;
import tools.jackson.databind.node.ArrayNode;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

public class MtgSetDeserializer extends StdDeserializer<MtgSet> {

    public MtgSetDeserializer() {
        this(MtgSet.class);
    }

    public MtgSetDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public MtgSet deserialize(JsonParser p, DeserializationContext ctxt) throws JacksonException {

        MtgSet set = new MtgSet();
        JsonNode node = p.objectReadContext().readTree(p);

        set.setId(UUID.fromString(node.get("id").asString()));
        set.setCode(node.get("code").asString());
        set.setName(node.get("name").asString());
        set.setType(node.get("type").asString());
        set.setReleaseDate(LocalDate.parse(node.get("release_date").asString(), DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        set.setIconUri(node.get("icon_uri").asString());
        set.setTotalCards(node.get("total_cards").asLong());

        ArrayNode cards = node.get("cards").asArray();
        for (JsonNode cardNode : cards) {
            MtgCard card = new MtgCard();
            card.setId(UUID.fromString(cardNode.get("id").asString()));
            card.setName(cardNode.get("name").asString());
            card.setType(cardNode.get("type").asString());
            card.setRarity(cardNode.get("rarity").asString());
            card.setManaCost(cardNode.get("mana_cost").asString());
            card.setCollectionNumber(cardNode.get("collection_number").asString());
            card.setSortNumber(cardNode.get("sort_number").asLong());
            card.setImageUriNormal(cardNode.get("image_uri_normal").asString());
            card.setImageUriArtCrop(cardNode.get("image_uri_art_crop").asString());
            card.setRegularPrice(cardNode.get("regular_price").asDouble() == -1.0D ? null : cardNode.get("regular_price").asDouble());
            card.setFoilPrice(cardNode.get("foil_price").asDouble() == 1.0D ? null : cardNode.get("foil_price").asDouble());
            card.setCollected(cardNode.get("collected").asBoolean());
            card.setOracleText(cardNode.get("oracle_text").asString());
            card.setArtist(cardNode.get("artist").asString());
            card.setPower(cardNode.get("power").asString());
            card.setToughness(cardNode.get("toughness").asString());
            card.setMtgSet(set);
            set.addCard(card);
        }

        return set;
    }
}
