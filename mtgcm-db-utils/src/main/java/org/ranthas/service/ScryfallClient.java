package org.ranthas.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.ranthas.model.ScryfallCard;
import org.ranthas.model.ScryfallList;
import org.ranthas.model.ScryfallSet;
import org.ranthas.model.ScryfallSymbol;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

public class ScryfallClient {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public ScryfallClient() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    }

    public List<ScryfallSymbol> fetchSymbols() {

        TypeReference<ScryfallList<ScryfallSymbol>> typeReference = new TypeReference<>() {};
        ScryfallList<ScryfallSymbol> response = fetchData("https://api.scryfall.com/symbology", typeReference);

        return processScryfallList(response, typeReference);
    }

    public List<ScryfallSet> fetchSets() {

        TypeReference<ScryfallList<ScryfallSet>> typeReference = new TypeReference<>() {};
        ScryfallList<ScryfallSet> response =  fetchData("https://api.scryfall.com/sets", new TypeReference<>() {});

        return processScryfallList(response, typeReference);
    }

    public List<ScryfallCard> fetchSetCards(String setCode) {

        TypeReference<ScryfallList<ScryfallCard>> typeReference = new TypeReference<>() {};
        ScryfallList<ScryfallCard> response =  fetchData("https://api.scryfall.com/cards/search?order=set&unique=prints&q=e:" + setCode, new TypeReference<>() {});

        return processScryfallList(response, typeReference);
    }

    private <T> ScryfallList<T> fetchData(String url, TypeReference<ScryfallList<T>> typeReference) {
        try {
            HttpRequest request = HttpRequest
                    .newBuilder()
                    .uri(new URI(url))
                    .GET()
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());

            if (response.statusCode() == 200) {
                return objectMapper.readValue(response.body(), typeReference);
            } else {
                System.err.println("Error response fetching data from Scryfall API");
                System.err.println("Status: " + response.statusCode());
                System.err.println("URI: " + url);
                System.err.println("Info: " + new String(response.body()));
                throw new RuntimeException("Error response fetching data from Scryfall API");
            }
        } catch (URISyntaxException | IOException | InterruptedException e) {
            System.err.println("Unexpected error fetching data from Scryfall API");
            e.printStackTrace();
            throw new RuntimeException("Unexpected error fetching data from Scryfall API");
        }
    }

    private <T> List<T> processScryfallList(ScryfallList<T> response, TypeReference<ScryfallList<T>> typeReference) {

        List<T> result = new ArrayList<>(response.getData());
        boolean hasMore = response.getHasMore();

        while (hasMore) {
            response = fetchData(response.getNextPage(), typeReference);
            result.addAll(response.getData());
            hasMore = response.getHasMore();
        }

        return result;
    }
}
