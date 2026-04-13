package org.ranthas.mtgcmapi.dto;

import java.time.LocalDate;

public record SetDto(String id, String name, String type, LocalDate releaseDate, Long totalCards) {
}
