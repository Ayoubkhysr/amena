package com.amena.backend.exception;

import com.amena.backend.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(
            ResponseStatusException ex,
            HttpServletRequest request) {

        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setTimestamp(OffsetDateTime.now(ZoneOffset.UTC));
        errorResponse.setStatus(ex.getStatusCode().value());
        errorResponse.setError(ex.getStatusCode().toString());
        errorResponse.setMessage(ex.getReason());
        errorResponse.setPath(request.getRequestURI());

        return ResponseEntity.status(ex.getStatusCode()).body(errorResponse);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException ex,
            HttpServletRequest request) {

        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setTimestamp(OffsetDateTime.now(ZoneOffset.UTC));
        errorResponse.setStatus(HttpStatus.BAD_REQUEST.value());
        errorResponse.setError(HttpStatus.BAD_REQUEST.getReasonPhrase());
        errorResponse.setMessage("Données invalides (référence manquante ou doublon).");
        errorResponse.setPath(request.getRequestURI());

        return ResponseEntity.badRequest().body(errorResponse);
    }
}
