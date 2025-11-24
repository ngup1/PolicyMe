package com.policyme.Policyme.util;

import com.policyme.Policyme.model.UserModel.AuthProvider;
import com.policyme.Policyme.model.UserModel.User;
import org.springframework.security.crypto.password.PasswordEncoder;

public class TestDataFactory {

    public static User createTestUser(PasswordEncoder passwordEncoder) {
        return User.builder()
                .email("sample@example.com")
                .firstName("Sample")
                .lastName("User")
                .passwordHash(passwordEncoder.encode("secret123"))
                .authProvider(AuthProvider.NONE)
                .build();
    }
}
