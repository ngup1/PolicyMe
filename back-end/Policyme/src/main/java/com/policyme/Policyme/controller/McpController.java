package com.policyme.Policyme.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.policyme.Policyme.dto.mcp.*;
import com.policyme.Policyme.mcp.PolicyMcpTools;
import com.policyme.Policyme.model.BillModel.Bill;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller exposing MCP-like tool discovery and invocation endpoints.
 */
@RestController
@RequestMapping("/mcp")
public class McpController {

    private final PolicyMcpTools mcpTools;
    private final ObjectMapper objectMapper;

    public McpController(PolicyMcpTools mcpTools, ObjectMapper objectMapper) {
        this.mcpTools = mcpTools;
        this.objectMapper = objectMapper;
    }

    /**
     * GET /mcp/tools - List available tools with their schemas.
     */
    @GetMapping("/tools")
    public ResponseEntity<List<ToolDescriptor>> listTools() {
        List<ToolDescriptor> tools = List.of(
                new ToolDescriptor(
                        "search_policy",
                        "Search for bills by title or policy area",
                        Map.of(
                                "type", "object",
                                "properties", Map.of(
                                        "query", Map.of("type", "string", "description", "Search query for bill title"),
                                        "policyArea", Map.of("type", "string", "description", "Policy area name")
                                ),
                                "required", List.of()
                        )
                ),
                new ToolDescriptor(
                        "get_recent_policies",
                        "Get the 20 most recently updated bills",
                        Map.of(
                                "type", "object",
                                "properties", Map.of(),
                                "required", List.of()
                        )
                ),
                new ToolDescriptor(
                        "summarize_policy",
                        "Generate an AI summary of a bill",
                        Map.of(
                                "type", "object",
                                "properties", Map.of(
                                        "billId", Map.of("type", "string", "description", "The ID of the bill")
                                ),
                                "required", List.of("billId")
                        )
                ),
                new ToolDescriptor(
                        "explain_policy_impact",
                        "Explain how a bill impacts a specific demographic",
                        Map.of(
                                "type", "object",
                                "properties", Map.of(
                                        "billId", Map.of("type", "string", "description", "The ID of the bill"),
                                        "demographics", Map.of(
                                                "type", "object",
                                                "description", "User demographics",
                                                "properties", Map.of(
                                                        "age", Map.of("type", "integer"),
                                                        "state", Map.of("type", "string"),
                                                        "income", Map.of("type", "number"),
                                                        "occupation", Map.of("type", "string")
                                                )
                                        )
                                ),
                                "required", List.of("billId", "demographics")
                        )
                ),
                new ToolDescriptor(
                        "ask_ai",
                        "Ask the AI assistant a question about legislation or policy",
                        Map.of(
                                "type", "object",
                                "properties", Map.of(
                                        "question", Map.of("type", "string", "description", "The question to ask the AI")
                                ),
                                "required", List.of("question")
                        )
                )
        );
        return ResponseEntity.ok(tools);
    }

    /**
     * POST /mcp/invoke - Invoke a tool by name with given parameters.
     */
    @PostMapping("/invoke")
    public ResponseEntity<ToolInvocationResponse> invokeTool(@RequestBody ToolInvocationRequest request) {
        try {
            String toolName = request.getToolName();
            Object params = request.getParameters();

            Object result = switch (toolName) {
                case "search_policy" -> {
                    SearchPolicyRequest req = objectMapper.convertValue(params, SearchPolicyRequest.class);
                    List<Bill> bills = mcpTools.searchPolicy(req.getQuery(), req.getPolicyArea());
                    yield bills;
                }
                case "get_recent_policies" -> {
                    List<Bill> bills = mcpTools.getRecentPolicies();
                    yield bills;
                }
                case "summarize_policy" -> {
                    SummarizePolicyRequest req = objectMapper.convertValue(params, SummarizePolicyRequest.class);
                    String summary = mcpTools.summarizePolicy(req.getBillId());
                    yield summary;
                }
                case "explain_policy_impact" -> {
                    ExplainPolicyImpactRequest req = objectMapper.convertValue(params, ExplainPolicyImpactRequest.class);
                    String explanation = mcpTools.explainPolicyImpact(req.getBillId(), req.getDemographics());
                    yield explanation;
                }
                case "ask_ai" -> {
                    AskAIRequest req = objectMapper.convertValue(params, AskAIRequest.class);
                    String answer = mcpTools.askAI(req.getQuestion());
                    yield answer;
                }
                default -> throw new IllegalArgumentException("Unknown tool: " + toolName);
            };

            return ResponseEntity.ok(new ToolInvocationResponse(true, result, null));
        } catch (Exception e) {
            return ResponseEntity.ok(new ToolInvocationResponse(false, null, e.getMessage()));
        }
    }
}
