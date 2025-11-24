package com.policyme.Policyme.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class InvalidCredentialsException extends RuntimeException{

    public InvalidCredentialsException() {
        super("Invalid Email or Password");
    }
}