package org.ranthas.mtgcmapi.exception;

import org.ranthas.mtgcmapi.dto.ApiErrorResponse;
import org.ranthas.mtgcmapi.exception.model.ImportCollectionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(RestResponseEntityExceptionHandler.class);

    @ExceptionHandler(ImportCollectionException.class)
    public ResponseEntity<ApiErrorResponse> handleImportCollectionException(ImportCollectionException exception) {

        LOGGER.error("Error importing file", exception);
        ApiErrorResponse response = new ApiErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnrecognizedException(Exception exception) {

        LOGGER.error("Exception not recognized and caught at final guard", exception);
        ApiErrorResponse response = new ApiErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Unknown error");

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
