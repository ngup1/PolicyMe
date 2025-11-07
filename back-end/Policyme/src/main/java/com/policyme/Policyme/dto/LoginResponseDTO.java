package com.policyme.Policyme.dto;

public record LoginResponseDTO(String token, String userId, String email, String firstName, String lastName) {
}

