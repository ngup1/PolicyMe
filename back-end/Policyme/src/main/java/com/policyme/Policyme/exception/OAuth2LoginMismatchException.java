package com.policyme.Policyme.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class OAuth2LoginMismatchException extends RuntimeException {

    public OAuth2LoginMismatchException() {
        super("Account exists with email/password. Please login using your credentials.");
    }
}
