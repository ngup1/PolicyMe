package com.policyme.Policyme.dto.mcp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Descriptor for an MCP tool.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToolDescriptor {
    private String name;
    private String description;
    private Map<String, Object> inputSchema; // JSON Schema object describing inputs
}
