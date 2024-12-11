package org.ranthas.mtgcollectionmanager.dto.collection;

import java.util.List;
import java.util.UUID;

public record CardDto(UUID id, String name, String scryfallUri, String rarity, String type, String collectorNumber,
                Long numericCollectorNumber, List<String> manaCost, CardQuantity quantity, CardPrice price,
                String image) {

}
