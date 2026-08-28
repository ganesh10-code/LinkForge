package com.url.shortner.exceptions;

public class DuplicateAliasException extends RuntimeException {
    public DuplicateAliasException(String message) {
        super(message);
    }
}
