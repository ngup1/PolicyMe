package com.policyme.Policyme.dto.mcp;

import com.policyme.Policyme.dto.Demographics;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExplainPolicyImpactRequest {
    private String billId;
    private Demographics demographics;
}
