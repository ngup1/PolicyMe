package com.policyme.Policyme.service.OAuth2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2FailureHandler implements AuthenticationFailureHandler {


    private String frontEndUrl = "http://localhost:3000/";

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {


        System.out.println("OAuth2 Login Failed: " + exception.getMessage());


        // Encode the error message to safely pass in URL
        String errorMessage = URLEncoder.encode(exception.getMessage(), StandardCharsets.UTF_8);

        // Redirect user to frontend with error message
        String redirectUrl = frontEndUrl + "/oauth-error?error=" + errorMessage;
        response.sendRedirect(redirectUrl);
    }
}
