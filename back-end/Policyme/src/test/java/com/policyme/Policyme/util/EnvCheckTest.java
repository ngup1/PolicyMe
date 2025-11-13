package com.policyme.Policyme.util;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

@SpringJUnitConfig
@ContextConfiguration(classes = {})
@TestPropertySource("file:.env")
class EnvCheckTest {

    @Value("${JWT_SECRET_KEY:NOT_FOUND}")
    String jwtKey;

    @Test
    void verifyEnvLoaded() {
        System.out.println("Working dir = " + System.getProperty("user.dir"));
        System.out.println("JWT_SECRET_KEY = " + jwtKey);
    }
}

