package org.ranthas.mtgcmapi.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
//@PropertySource("classpath:application.properties")
public class ScryfallProperties {

    private final String baseUrl;
    private final Integer maxInMemSize;
    private final String userAgentHeader;
    private final String acceptHeader;
    private final String setsUri;
    private final String setByCodeUri;
    private final String setCardsUri;

    public ScryfallProperties(@Value("${base-url}") String baseUrl,
                              @Value("${max-in-mem-size}") Integer maxInMemSize,
                              @Value("${user-agent-header}") String userAgentHeader,
                              @Value("${accept-header}") String acceptHeader,
                              @Value("${sets-uri}") String setsUri,
                              @Value("${set-by-code-uri}") String setByCodeUri,
                              @Value("${set-cards-uri}") String setCardsUri) {
        this.baseUrl = baseUrl;
        this.maxInMemSize = maxInMemSize;
        this.userAgentHeader = userAgentHeader;
        this.acceptHeader = acceptHeader;
        this.setsUri = setsUri;
        this.setByCodeUri = setByCodeUri;
        this.setCardsUri = setCardsUri;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public Integer getMaxInMemSize() {
        return maxInMemSize;
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
