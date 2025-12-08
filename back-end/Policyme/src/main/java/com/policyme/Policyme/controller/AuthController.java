package com.policyme.Policyme.controller;

import com.policyme.Policyme.dto.*;
import com.policyme.Policyme.model.UserModel.User;
import com.policyme.Policyme.security.CustomUserDetails;
import com.policyme.Policyme.security.JwtUtil;
import com.policyme.Policyme.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {


    private final UserService userService;


    private final JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<SignUpResponseDTO> signUp(@Valid @RequestBody SignUpRequestDTO request) {
        SignUpResponseDTO response = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = userService.login(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<LoginResponseDTO> getCurrentUser(Authentication authentication){
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = customUserDetails.getUser();

        String jwtToken = jwtUtil.generateJwtToken(user.getUserId()); // refresh token


        UserDTO userDTO = new UserDTO(user);

        LoginResponseDTO response = new LoginResponseDTO(
                jwtToken,
                userDTO,
                true,
                "User info fetched successfully"
        );
        System.out.println(response);

        return ResponseEntity.ok(response);
    }

}

