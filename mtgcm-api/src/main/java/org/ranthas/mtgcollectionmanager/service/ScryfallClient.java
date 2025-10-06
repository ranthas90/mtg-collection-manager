package org.ranthas.mtgcollectionmanager.service;

import org.ranthas.mtgcollectionmanager.dto.ScryfallCard;
import org.ranthas.mtgcollectionmanager.dto.ScryfallList;
import org.ranthas.mtgcollectionmanager.dto.ScryfallSet;
import org.ranthas.mtgcollectionmanager.dto.ScryfallSymbol;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

@Service
public class ScryfallClient {

    private final WebClient webClient;

    private static final String SCRYFALL_BASE_URL = "https://api.scryfall.com";
    private static final int CODEC_MEMORY_SIZE = 20_971_522;

    public ScryfallClient() {
        webClient = WebClient
                .builder()
                .baseUrl(SCRYFALL_BASE_URL)
                .codecs(configure -> configure.defaultCodecs().maxInMemorySize(CODEC_MEMORY_SIZE))
                .build();
    }

    public List<ScryfallSymbol> fetchSymbols() {

        ParameterizedTypeReference<ScryfallList<ScryfallSymbol>> typeReference = new ParameterizedTypeReference<>() {};
        ScryfallList<ScryfallSymbol> response = fetchData("/symbology", typeReference);

        return processScryfallList(response, typeReference);
    }

    public ScryfallSet fetchSetByCode(String code) {
        return fetchData("/sets/" + code, new ParameterizedTypeReference<>() {});
    }

    public List<ScryfallSet> fetchSets() {

        ParameterizedTypeReference<ScryfallList<ScryfallSet>> typeReference = new ParameterizedTypeReference<>() {};
        ScryfallList<ScryfallSet> response = fetchData("/sets", typeReference);

        return processScryfallList(response, typeReference);
    }

    public List<ScryfallCard> fetchSetCards(String setCode) {

        ParameterizedTypeReference<ScryfallList<ScryfallCard>> typeReference = new ParameterizedTypeReference<>() {};
        Function<UriBuilder, URI> url = uriBuilder -> uriBuilder
                .path("/cards/search")
                .queryParam("order", "set")
                .queryParam("unique", "prints")
                .queryParam("q", String.format("e:%s", setCode))
                .build();

        ScryfallList<ScryfallCard> response = fetchData(url, typeReference);

        return processScryfallList(response, typeReference);
    }

    private <T> T fetchData(String url, ParameterizedTypeReference<T> typeReference) {
        return webClient
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(typeReference)
                .block();
    }

    private <T> T fetchData(Function<UriBuilder, URI> url, ParameterizedTypeReference<T> typeReference) {
        return webClient
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(typeReference)
                .block();
    }

    private <T> List<T> processScryfallList(
            ScryfallList<T> response,
            ParameterizedTypeReference<ScryfallList<T>> typeReference
    ) {

        List<T> data = new ArrayList<>(response.getData());

        while (response.getHasMore()) {
            String nextPage = response.getNextPage();
            response = fetchData(nextPage, typeReference);
            data.addAll(response.getData());
        }

        return data;
    }
}
