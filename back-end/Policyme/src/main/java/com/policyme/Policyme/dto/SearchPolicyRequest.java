package com.policyme.Policyme.dto;

import lombok.Data;

@Data
public class SearchPolicyRequest {
    private String query;          // free text in title
    private String policyArea;     // optional policy area name
}
