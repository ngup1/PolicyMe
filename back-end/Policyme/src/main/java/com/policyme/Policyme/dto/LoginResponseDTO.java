package com.policyme.Policyme.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private String userId;
    private String email;
    private String firstName;
    private String lastName;
    private boolean success;
    private String message;
}

