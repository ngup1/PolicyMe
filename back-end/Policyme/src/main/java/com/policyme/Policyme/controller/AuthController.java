package com.policyme.Policyme.controller;

import com.policyme.Policyme.dto.ApiResponse;
import com.policyme.Policyme.dto.LoginRequestDTO;
import com.policyme.Policyme.dto.LoginResponseDTO;
import com.policyme.Policyme.dto.SignUpRequestDTO;
import com.policyme.Policyme.model.UserModel.AuthProvider;
import com.policyme.Policyme.model.UserModel.User;
import com.policyme.Policyme.repository.UserRepository;
import com.policyme.Policyme.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AuthController {
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequestDTO request){

        if (userRepository.findByEmail(request.getEmail()).isPresent()){ //the user already exists within the db
            return ResponseEntity.status(409).body(new ApiResponse(false, "Email already exists"));
        }
        User user = User.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .authProvider(AuthProvider.NONE)
                .providerId(null)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        return ResponseEntity.status(201).body(new ApiResponse(true, "User created successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO request) {
        var userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body(new ApiResponse(false, "Invalid email or password"));
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body(new ApiResponse(false, "Invalid email or password"));
        }

        String token = jwtUtil.generateJwtToken(user.getUserId());

        LoginResponseDTO response = new LoginResponseDTO(
                token,
                user.getUserId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName()
        );

        return ResponseEntity.ok(response);
    }
}
