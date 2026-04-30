package org.ranthas.mtgcmapi.service;

import org.ranthas.mtgcmapi.entity.MtgCard;
import org.ranthas.mtgcmapi.entity.MtgSet;
import org.springframework.stereotype.Component;
import tools.jackson.core.JacksonException;
import tools.jackson.core.JsonGenerator;
import tools.jackson.databind.SerializationContext;
import tools.jackson.databind.ser.std.StdSerializer;

import java.time.format.DateTimeFormatter;

@Component
public class MtgSetSerializer extends StdSerializer<MtgSet> {

    public MtgSetSerializer() {
        this(null);
    }

    public MtgSetSerializer(Class<MtgSet> t) {
        super(t);
    }

    @Override
    public void serialize(MtgSet value, JsonGenerator gen, SerializationContext ctxt) throws JacksonException {

        gen.writeStartObject();
        gen.writeStringProperty("id", value.getId().toString());
        gen.writeStringProperty("code", value.getCode());
        gen.writeStringProperty("name", value.getName());
        gen.writeStringProperty("type", value.getType());
        gen.writeStringProperty("release_date", value.getReleaseDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        gen.writeNumberProperty("total_cards", value.getTotalCards());
        gen.writeStringProperty("icon_uri", value.getIconUri());
        gen.writeArrayPropertyStart("cards");

        for (MtgCard card : value.getCards()) {
            gen.writeStartObject();
            gen.writeStringProperty("id", card.getId().toString());
            gen.writeStringProperty("name", card.getName());
            gen.writeStringProperty("type", card.getType());
            gen.writeStringProperty("rarity", card.getRarity());
            gen.writeStringProperty("mana_cost", card.getManaCost());
            gen.writeStringProperty("collection_number", card.getCollectionNumber());
            gen.writeNumberProperty("sort_number", card.getSortNumber());
            gen.writeStringProperty("image_uri_normal", card.getImageUriNormal());
            gen.writeStringProperty("image_uri_art_crop", card.getImageUriArtCrop());
            gen.writeNumberProperty("regular_price", card.getRegularPrice() == null ? -1.0D : card.getRegularPrice());
            gen.writeNumberProperty("foil_price", card.getFoilPrice() == null ? -1.0D : card.getFoilPrice());
            gen.writeBooleanProperty("collected", card.isCollected());
            gen.writeStringProperty("oracle_text", card.getOracleText());
            gen.writeStringProperty("artist", card.getArtist());
            gen.writeStringProperty("power", card.getPower());
            gen.writeStringProperty("toughness", card.getToughness());
            gen.writeEndObject();
        }

        gen.writeEndArray();
        gen.writeEndObject();
    }
}
