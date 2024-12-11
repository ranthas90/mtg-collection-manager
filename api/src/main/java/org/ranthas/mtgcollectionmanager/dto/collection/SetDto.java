package org.ranthas.mtgcollectionmanager.dto.collection;

import java.time.LocalDate;
import java.util.UUID;

public record SetDto(UUID id, String code, String name, String iconPath, long totalCards, long ownedCards,
        LocalDate releasedAt, String setType) {
}
