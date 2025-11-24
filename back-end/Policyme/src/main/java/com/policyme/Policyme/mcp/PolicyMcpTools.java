package com.policyme.Policyme.mcp;

import com.policyme.Policyme.dto.Demographics;
import com.policyme.Policyme.model.BillModel.Bill;
import com.policyme.Policyme.service.PolicyAiService;
import com.policyme.Policyme.service.PolicyImpactService;
import com.policyme.Policyme.service.PolicySearchService;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Scaffolding for MCP tools. These methods can be exposed to an MCP server when configured.
 * For now, they are plain Spring beans that can be wired into an MCP adapter later.
 */
@Component
public class PolicyMcpTools {

    private final PolicySearchService searchService;
    private final PolicyAiService aiService;
    private final PolicyImpactService impactService;

    public PolicyMcpTools(PolicySearchService searchService,
                          PolicyAiService aiService,
                          PolicyImpactService impactService) {
        this.searchService = searchService;
        this.aiService = aiService;
        this.impactService = impactService;
    }

    public List<Bill> searchPolicy(String query, String policyArea) {
        return searchService.search(query, policyArea);
    }

    public List<Bill> getRecentPolicies() {
        return searchService.getRecentBills();
    }

    public String summarizePolicy(String billId) {
        if (billId == null || billId.isBlank()) {
            return "billId is required";
        }
        return aiService.summarizeBill(billId);
    }

    public String explainPolicyImpact(String billId, Demographics demographics) {
        if (billId == null || billId.isBlank() || demographics == null) {
            return "billId and demographics are required";
        }
        return impactService.explainImpact(billId, demographics);
    }
}
