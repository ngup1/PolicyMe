package com.policyme.Policyme.controller;

import com.policyme.Policyme.dto.LoginRequestDTO;
import com.policyme.Policyme.dto.LoginResponseDTO;
import com.policyme.Policyme.dto.SignUpRequestDTO;
import com.policyme.Policyme.dto.SignUpResponseDTO;
import com.policyme.Policyme.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {


    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<SignUpResponseDTO> signUp(@Valid @RequestBody SignUpRequestDTO request) {
        SignUpResponseDTO response = userService.registerUser(request);
        return ResponseEntity.status(200).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = userService.login(request);
        return ResponseEntity.status(201).body(response);
    }
}

