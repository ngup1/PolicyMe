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

    @PutMapping("/demographics")
    public ResponseEntity<UserDTO> updateDemographics(
            Authentication authentication,
            @RequestBody DemographicsDTO demographics) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = customUserDetails.getUser();

        User updatedUser = userService.updateUserDemographics(user.getUserId(), demographics);
        UserDTO userDTO = new UserDTO(updatedUser);

        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/demographics")
    public ResponseEntity<DemographicsDTO> getDemographics(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = customUserDetails.getUser();

        DemographicsDTO dto = new DemographicsDTO(
                user.getAge(),
                user.getState(),
                user.getIncomeBracket(),
                user.getVeteran(),
                user.getStudent(),
                user.getSmallBusinessOwner()
        );

        return ResponseEntity.ok(dto);
    }

}

