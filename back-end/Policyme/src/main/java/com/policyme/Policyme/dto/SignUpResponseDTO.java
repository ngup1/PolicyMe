package com.policyme.Policyme.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignUpResponseDTO {
    private String token;
    private UserDTO user; //simplified this will hold all the information of the user;
    private boolean success;
    private String message;
}
