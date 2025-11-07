package com.policyme.Policyme.startup;

import com.policyme.Policyme.model.UserModel.AuthProvider;
import com.policyme.Policyme.model.UserModel.User;
import com.policyme.Policyme.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create a test user if it doesn't exist
        if (userRepository.findByEmail("test@example.com").isEmpty()) {
            User testUser = User.builder()
                    .email("test@example.com")
                    .firstName("Test")
                    .lastName("User")
                    .passwordHash(passwordEncoder.encode("testPassword123"))
                    .authProvider(AuthProvider.NONE)
                    .providerId(null)
                    .build();
            
            userRepository.save(testUser);
            System.out.println("Test user created: email=test@example.com, password=testPassword123");
        }
    }
}

