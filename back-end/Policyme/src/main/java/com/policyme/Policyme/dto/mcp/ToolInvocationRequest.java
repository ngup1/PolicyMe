package com.policyme.Policyme.dto.mcp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic request to invoke an MCP tool.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToolInvocationRequest {
    private String toolName;
    private Object parameters; // JSON object matching the tool's input schema
}
