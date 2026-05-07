package org.ranthas.mtgcmapi.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ScryfallProperties {

    private final String baseUrl;
    private final String userAgentHeader;
    private final String acceptHeader;
    private final String setsUri;
    private final String setByCodeUri;
    private final String setCardsUri;

    public ScryfallProperties(@Value("${scryfall.base-url}") String baseUrl,
                              @Value("${scryfall.user-agent-header}") String userAgentHeader,
                              @Value("${scryfall.accept-header}") String acceptHeader,
                              @Value("${scryfall.sets-uri}") String setsUri,
                              @Value("${scryfall.set-by-code-uri}") String setByCodeUri,
                              @Value("${scryfall.set-cards-uri}") String setCardsUri) {
        this.baseUrl = baseUrl;
        this.userAgentHeader = userAgentHeader;
        this.acceptHeader = acceptHeader;
        this.setsUri = setsUri;
        this.setByCodeUri = setByCodeUri;
        this.setCardsUri = setCardsUri;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public String getUserAgentHeader() {
        return userAgentHeader;
    }

    public String getAcceptHeader() {
        return acceptHeader;
    }

    public String getSetsUri() {
        return setsUri;
    }

    public String getSetByCodeUri() {
        return setByCodeUri;
    }

    public String getSetCodeByUri(String code) {
        return String.format(setByCodeUri, code);
    }

    public String getSetCardsUri() {
        return setCardsUri;
    }

    public String getSetCardsUri(String code) {
        return String.format(setCardsUri, code);
    }
}
