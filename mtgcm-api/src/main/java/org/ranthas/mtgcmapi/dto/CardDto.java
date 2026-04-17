package org.ranthas.mtgcmapi.dto;

public record CardDto(String id, String name, String type, String rarity, String manaCost, String collectionNumber,
                      String imageUriNormal, String imageUriArtCrop, String oracleText, Double regularPrice,
                      Double foilPrice, Boolean collected) {
}
