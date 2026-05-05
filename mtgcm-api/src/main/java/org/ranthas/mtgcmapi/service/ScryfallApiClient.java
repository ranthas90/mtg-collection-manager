package org.ranthas.mtgcmapi.service;

import org.ranthas.mtgcmapi.configuration.ScryfallProperties;
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

    private final ScryfallProperties properties;
    private final WebClient webClient;

    private static final Logger LOGGER = LoggerFactory.getLogger(ScryfallApiClient.class);

    public ScryfallApiClient(ScryfallProperties properties) {
        this.properties = properties;
        this.webClient = WebClient.builder()
                .baseUrl(properties.getBaseUrl())
                .codecs(clientCodecConfigurer -> clientCodecConfigurer.defaultCodecs().maxInMemorySize(-1))
                .defaultHeaders(httpHeaders -> {
                    httpHeaders.add(HttpHeaders.USER_AGENT, properties.getUserAgentHeader());
                    httpHeaders.add(HttpHeaders.ACCEPT, properties.getAcceptHeader());
                })
                .build();
    }

    public List<ScryfallSet> findAllSets() {
        try {
            ScryfallList<ScryfallSet> setsResponse = sendRequest(properties.getSetsUri(), new ParameterizedTypeReference<>() {});
            return setsResponse.getData().stream().filter(ScryfallSet::isValid).toList();
        } catch (WebClientException e) {
            LOGGER.error("Error finding all sets from Scryfall", e);
            return Collections.emptyList();
        }
    }

    public ScryfallSet findSetByCode(String code) {
        try {
            return sendRequest(properties.getSetCodeByUri(code), ScryfallSet.class);
        } catch (WebClientException e) {
            LOGGER.error("Error finding set {} from Scryfall", code, e);
            return null;
        }
    }

    public List<ScryfallCard> findSetCards(String setCode) {
        try {
            ScryfallList<ScryfallCard> cardsResponse = sendRequest(properties.getSetCardsUri(setCode), new ParameterizedTypeReference<>() {});
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
