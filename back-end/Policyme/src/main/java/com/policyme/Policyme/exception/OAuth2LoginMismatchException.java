package com.policyme.Policyme.exception;

import org.springframework.security.core.AuthenticationException;

public class OAuth2LoginMismatchException extends AuthenticationException {

    public OAuth2LoginMismatchException() {
        super("Account exists with a different provider. Please login using your original provider.");
    }
}
