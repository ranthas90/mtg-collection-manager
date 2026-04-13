package org.ranthas.mtgcmapi.service;

import org.ranthas.mtgcmapi.dto.ScryfallList;
import org.ranthas.mtgcmapi.dto.ScryfallSet;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

public class ScryfallApiClient {

    private final WebClient webClient;

    public ScryfallApiClient() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.scryfall.com")
                .defaultHeaders(httpHeaders -> {
                    httpHeaders.add(HttpHeaders.USER_AGENT, "mtgcm-api/1.0");
                    httpHeaders.add(HttpHeaders.ACCEPT, "application/json;q=0.9,*/*;q=0.8");
                })
                .build();
    }

    public List<ScryfallSet> findAllSets() {
        return webClient.get()
                .uri("/sets")
                .retrieve()
                .onStatus(HttpStatusCode::is5xxServerError, response -> Mono.error(new RuntimeException("Scryfall client error" + response.statusCode())))
                .bodyToMono(new ParameterizedTypeReference<ScryfallList<ScryfallSet>>() {})
                .block()
                .getData()
                .stream()
                .filter(ScryfallSet::isValid)
                .toList();
    }

    public ScryfallSet findSetByCode(String code) {
        return webClient.get()
                .uri(String.format("/sets/%s", code))
                .retrieve()
                .onStatus(HttpStatusCode::is5xxServerError, response -> Mono.error(new RuntimeException("Scryfall client error" + response.statusCode())))
                .bodyToMono(ScryfallSet.class)
                .block();
    }
}
