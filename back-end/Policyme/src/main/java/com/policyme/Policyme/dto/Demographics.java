package com.policyme.Policyme.dto;

import lombok.Data;

@Data
public class Demographics {
    private Integer age;
    private String state;
    private String zip;
    private String incomeBracket; // e.g., low, middle, high
    private Boolean veteran;
    private Boolean student;
    private Boolean smallBusinessOwner;
}
