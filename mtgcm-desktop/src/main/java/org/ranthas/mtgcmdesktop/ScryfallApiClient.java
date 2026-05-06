package org.ranthas.mtgcmdesktop;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

public class ScryfallApiClient {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public ScryfallApiClient() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    }

    public List<ScryfallSet> findAllSets() {
        ScryfallList<ScryfallSet> sets = send("https://api.scryfall.com/sets", new TypeReference<>() {});

        if (sets != null) {
            return sets.getData().stream().filter(ScryfallSet::isValid).toList();
        }

        return null;
    }

    public ScryfallSet findSetByCode(String code) {
        String uri = String.format("https://api.scryfall.com/sets/%s", code);
        return send(uri, new TypeReference<>() {});
    }

    public List<ScryfallCard> findSetCards(String setCode) {
        boolean hasMore = true;
        String uri = String.format("https://api.scryfall.com/cards/search?include_extras=true&include_variations=true&order=set&q=e:%s&unique=prints", setCode);
        List<ScryfallCard> cards = new ArrayList<>();

        while (hasMore) {
            ScryfallList<ScryfallCard> cardsResponse = send(uri, new TypeReference<>(){});
            if (cardsResponse != null) {
                uri = cardsResponse.getNextPage();
                hasMore = cardsResponse.getHasMore();
                cards.addAll(cardsResponse.getData());
            } else {
                return null;
            }
        }

        return cards;
    }

    private <T> T send(String uri, TypeReference<T> type) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(uri))
                    .header("User-Agent", "mtgcm-desktop/1.0")
                    .header("Accept", "application/json;q=0.9,*/*;q=0.8")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 400) {
                String data = response.body();
                return objectMapper.readValue(data, type);
            } else {
                return null;
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return null;
        }
    }
}
