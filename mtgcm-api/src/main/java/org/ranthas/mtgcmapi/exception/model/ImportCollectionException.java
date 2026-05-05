package org.ranthas.mtgcmapi.exception.model;

import java.io.IOException;

public class ImportCollectionException extends RuntimeException {

    public ImportCollectionException(String message) {
        super(message);
    }

    public ImportCollectionException(String message, IOException exception) {
        super(message, exception);
    }
}
