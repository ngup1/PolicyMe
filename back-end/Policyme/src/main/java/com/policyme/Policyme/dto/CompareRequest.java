package com.policyme.Policyme.dto;

import lombok.Data;

@Data
public class CompareRequest {
    private String billIdA;
    private String billIdB;
}
