package com.policyme.Policyme.dto.mcp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response envelope for MCP tool invocations.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToolInvocationResponse {
    private boolean success;
    private Object result; // Tool output (could be list, string, object, etc.)
    private String error; // Error message if success=false
}
