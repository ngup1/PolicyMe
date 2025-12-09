package com.policyme.Policyme.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DemographicsDTO {
    private Integer age;
    private String state;
    private String incomeBracket;
    private Boolean veteran;
    private Boolean student;
    private Boolean smallBusinessOwner;
}
