package com.policyme.Policyme.config;


import com.policyme.Policyme.security.OAuth2.CustomOAuth2UserService;
import com.policyme.Policyme.security.OAuth2.OAuth2FailureHandler;
import com.policyme.Policyme.security.OAuth2.OAuth2SuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {


    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final OAuth2FailureHandler oAuth2FailureHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Disable sessions because we use JWT
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Disable CSRF since we are not using Cookies for auth
                .csrf(csrf -> csrf.disable())



                // OAuth2 Login Flow Configuration
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo ->
                                userInfo.userService(customOAuth2UserService))  // Create/Find user in DB
                        .successHandler(oAuth2SuccessHandler)                    // Issue JWT after OAuth success
                        .failureHandler(oAuth2FailureHandler)                    // Handle OAuth errors
                );


        return http.build();
    }

    // Needed if you use local login (/auth/login)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
