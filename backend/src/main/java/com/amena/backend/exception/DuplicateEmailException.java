package com.amena.backend.exception;

/**
 * Exception thrown when attempting to create a user with an email that already exists.
 */
public class DuplicateEmailException extends RuntimeException {

    private final String email;

    public DuplicateEmailException(String email) {
        super("User with email '" + email + "' already exists");
        this.email = email;
    }

    public String getEmail() {
        return email;
    }
}