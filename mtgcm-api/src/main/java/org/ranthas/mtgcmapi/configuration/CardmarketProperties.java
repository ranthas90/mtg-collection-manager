package org.ranthas.mtgcmapi.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CardmarketProperties {

    private final String appToken;
    private final String appSecret;
    private final String accessToken;
    private final String accessTokenSecret;
    private final String wantslistUri;

    public CardmarketProperties(@Value("${cardmarket.app-token}") String appToken,
                                @Value("${cardmarket.app-secret}") String appSecret,
                                @Value("${cardmarket.access-token}") String accessToken,
                                @Value("${cardmarket.access-token-secret}") String accessTokenSecret,
                                @Value("${cardmarket.wantslist-uri}") String wantslistUri) {
        this.appToken = appToken;
        this.appSecret = appSecret;
        this.accessToken = accessToken;
        this.accessTokenSecret = accessTokenSecret;
        this.wantslistUri = wantslistUri;
    }

    public String getAppToken() {
        return appToken;
    }

    public String getAppSecret() {
        return appSecret;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getAccessTokenSecret() {
        return accessTokenSecret;
    }

    public String getWantslistUri() {
        return wantslistUri;
    }
}
