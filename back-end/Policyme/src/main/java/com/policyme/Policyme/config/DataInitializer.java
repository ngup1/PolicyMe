package com.policyme.Policyme.config;

import com.policyme.Policyme.entity.User;
import com.policyme.Policyme.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public void run(String... args) throws Exception {
        // Create a test user if it doesn't exist
        if (userRepository.findByUsername("testuser").isEmpty()) {
            User testUser = new User();
            testUser.setUsername("testuser");
            testUser.setEmail("test@example.com");
            testUser.setPassword(passwordEncoder.encode("testPassword123"));
            userRepository.save(testUser);
            System.out.println("Test user created: username=testuser, password=testPassword123");
        }
    }
}

