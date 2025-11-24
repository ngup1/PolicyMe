package com.policyme.Policyme.dto.mcp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchPolicyRequest {
    private String query;
    private String policyArea;
}
