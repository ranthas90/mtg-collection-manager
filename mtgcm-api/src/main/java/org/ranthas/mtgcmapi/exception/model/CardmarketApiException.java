package org.ranthas.mtgcmapi.exception.model;

public class CardmarketApiException extends RuntimeException {

    public CardmarketApiException(String message, Throwable exception) {
        super(message, exception);
    }
}
