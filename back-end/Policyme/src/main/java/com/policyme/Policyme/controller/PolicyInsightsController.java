package com.policyme.Policyme.controller;

import com.policyme.Policyme.dto.ImpactRequest;
import com.policyme.Policyme.dto.SearchPolicyRequest;
import com.policyme.Policyme.model.BillModel.Bill;
import com.policyme.Policyme.service.PolicyImpactService;
import com.policyme.Policyme.service.PolicySearchService;
import com.policyme.Policyme.service.PolicyAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/policy")
public class PolicyInsightsController {

    private final PolicySearchService searchService;
    private final PolicyImpactService impactService;
    private final PolicyAiService aiService;

    public PolicyInsightsController(PolicySearchService searchService,
                                    PolicyImpactService impactService,
                                    PolicyAiService aiService) {
        this.searchService = searchService;
        this.impactService = impactService;
        this.aiService = aiService;
    }

    @PostMapping("/search")
    public ResponseEntity<List<Bill>> search(@RequestBody SearchPolicyRequest req) {
        return ResponseEntity.ok(searchService.search(req.getQuery(), req.getPolicyArea()));
    }

    @PostMapping("/impact")
    public ResponseEntity<String> impact(@RequestBody ImpactRequest req) {
        if (req == null || req.getBillId() == null || req.getDemographics() == null) {
            return ResponseEntity.badRequest().body("billId and demographics are required");
        }
        return ResponseEntity.ok(impactService.explainImpact(Objects.requireNonNull(req.getBillId()), Objects.requireNonNull(req.getDemographics())));
    }

    @GetMapping("/summarize/{billId}")
    public ResponseEntity<String> summarize(@PathVariable String billId) {
        if (billId == null || billId.isBlank()) {
            return ResponseEntity.badRequest().body("billId is required");
        }
        return ResponseEntity.ok(aiService.summarizeBill(Objects.requireNonNull(billId)));
    }
}
