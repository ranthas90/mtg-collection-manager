package org.ranthas.mtgcmapi.service;

import org.ranthas.mtgcmapi.dto.ScryfallCard;
import org.ranthas.mtgcmapi.dto.ScryfallList;
import org.ranthas.mtgcmapi.dto.ScryfallSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class ScryfallApiClient {

    private final WebClient webClient;
    private static final Logger LOGGER = LoggerFactory.getLogger(ScryfallApiClient.class);

    public ScryfallApiClient() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.scryfall.com")
                .codecs(clientCodecConfigurer -> clientCodecConfigurer.defaultCodecs().maxInMemorySize(-1))
                .defaultHeaders(httpHeaders -> {
                    httpHeaders.add(HttpHeaders.USER_AGENT, "mtgcm-api/1.0");
                    httpHeaders.add(HttpHeaders.ACCEPT, "application/json;q=0.9,*/*;q=0.8");
                })
                .build();
    }

    public List<ScryfallSet> findAllSets() {
        try {
            ScryfallList<ScryfallSet> setsResponse = sendRequest("/sets", new ParameterizedTypeReference<>() {});
            return setsResponse.getData().stream().filter(ScryfallSet::isValid).toList();
        } catch (WebClientException e) {
            LOGGER.error("Error finding all sets from Scryfall", e);
            return Collections.emptyList();
        }
    }

    public ScryfallSet findSetByCode(String code) {
        try {
            return sendRequest(String.format("/sets/%s", code), ScryfallSet.class);
        } catch (WebClientException e) {
            LOGGER.error("Error finding set {} from Scryfall", code, e);
            return null;
        }
    }

    public List<ScryfallCard> findSetCards(String setCode) {
        try {

            String initialUri = String.format("https://api.scryfall.com/cards/search?include_extras=true&include_variations=true&order=set&q=e:%s&unique=prints", setCode);
            ScryfallList<ScryfallCard> cardsResponse = sendRequest(initialUri, new ParameterizedTypeReference<>() {});
            List<ScryfallCard> cards = new ArrayList<>(cardsResponse.getData());

            while(cardsResponse.getHasMore()) {
                cardsResponse = sendRequest(cardsResponse.getNextPage(), new ParameterizedTypeReference<>() {});
                cards.addAll(cardsResponse.getData());
            }

            return cards;

        } catch (WebClientException e) {
            LOGGER.error("Error finding set {} cards from Scryfall", setCode, e);
            return Collections.emptyList();
        }
    }

    private <T> T sendRequest(String uri, Class<T> typeReference) {
        return webClient.get().uri(uri).retrieve().bodyToMono(typeReference).block();
    }

    private <T> T sendRequest(String uri, ParameterizedTypeReference<T> typeReference) {
        return webClient.get().uri(uri).retrieve().bodyToMono(typeReference).block();
    }
}
