package com.policyme.Policyme.service;

import com.policyme.Policyme.dto.LoginRequest;
import com.policyme.Policyme.dto.LoginResponse;
import com.policyme.Policyme.entity.User;
import com.policyme.Policyme.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public LoginResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElse(null);
        
        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return new LoginResponse("Invalid username or password", null, null, false);
        }
        
        return new LoginResponse("Login successful", user.getUsername(), user.getId(), true);
    }
}


