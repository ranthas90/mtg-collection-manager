package org.ranthas.mtgcmapi.service;

import org.ranthas.mtgcmapi.configuration.CardmarketProperties;
import org.ranthas.mtgcmapi.dto.WantsList;
import org.ranthas.mtgcmapi.exception.model.CardmarketApiException;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class CardmarketApiClient {

    private final CardmarketProperties properties;
    private final WebClient webClient;

    public CardmarketApiClient(CardmarketProperties properties) {
        this.properties = properties;
        this.webClient = WebClient.builder()
                .baseUrl("https://apiv2.cardmarket.com/ws/v2.0")
                .codecs(c -> c.defaultCodecs().maxInMemorySize(-1))
                .build();
    }

    // TODO: ir añadiendo métodos para manipular la wishlist
    public void test() {
        webClient
                .get()
                .uri(properties.getWantslistUri())
                .header("Authorization", buildAuthorizationHeader(HttpMethod.GET, properties.getWantslistUri()))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<WantsList>>() {})
                .block();
    }

    // https://api.cardmarket.com/ws/documentation/API:Auth_java
    private String buildAuthorizationHeader(HttpMethod method, String request) {

        String oauthVersion = "2.0";
        String oauthTimestamp = (System.currentTimeMillis() / 1000) + "";
        String oauthNonce = UUID.randomUUID().toString();
        String oauthConsumerKey = properties.getAppToken();
        String oauthToken = properties.getAccessToken();
        String oauthSignatureMethod = "HMAC-SHA1";

        String encodedRequestUrl = rawUrlEncode(request);
        String authorization = method + "&" + encodedRequestUrl + "&";
        String paramString = "oauth_consumer_key=" + rawUrlEncode(oauthConsumerKey) + "&" +
                "oauth_nonce=" + rawUrlEncode(oauthNonce) + "&" +
                "oauth_signature_method=" + rawUrlEncode(oauthSignatureMethod) + "&" +
                "oauth_timestamp=" + rawUrlEncode(oauthTimestamp) + "&" +
                "oauth_token=" + rawUrlEncode(oauthToken) + "&" +
                "oauth_version" + rawUrlEncode(oauthVersion);

        authorization = authorization + rawUrlEncode(paramString);
        String oauthSignature = encodeOauthSignature(authorization);

        return "OAuth " +
                "realm=\"" + request + "\", " +
                "oauth_version=\"" + oauthVersion + "\", " +
                "oauth_timestamp=\"" + oauthTimestamp + "\", " +
                "oauth_nonce=\"" + oauthNonce + "\", " +
                "oauth_consumer_key=\"" + oauthConsumerKey + "\", " +
                "oauth_token=\"" + oauthToken + "\", " +
                "oauth_signature_method=\"" + oauthSignatureMethod + "\", " +
                "oauth_signature=\"" + oauthSignature + "\"";
    }

    private String rawUrlEncode(String value) {
        return URLEncoder.encode(value, Charset.defaultCharset());
    }

    private String encodeOauthSignature(String authorization) {
        try {
            String signingKey = rawUrlEncode(properties.getAppSecret()) + "&" +
                    rawUrlEncode(properties.getAccessTokenSecret());

            Mac mac = Mac.getInstance("HmacSHA1");
            SecretKeySpec secretKeySpec = new SecretKeySpec(signingKey.getBytes(), mac.getAlgorithm());
            mac.init(secretKeySpec);

            byte[] digest = mac.doFinal(authorization.getBytes());
            return Base64.getEncoder().encodeToString(digest);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new CardmarketApiException("Error encoding OAuth signature", e);
        }
    }
}
