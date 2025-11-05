package com.policyme.Policyme.controller;

import com.policyme.Policyme.service.AmendmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/amendments")
public class AmendmentController {

    private final AmendmentService amendmentService;

    public AmendmentController(AmendmentService amendmentService) {
        this.amendmentService = amendmentService;
    }

    @GetMapping("/fetch")
    public ResponseEntity<String> fetchAllAmendments() {
        amendmentService.fetchAllAmendmentDataAsync();
        return ResponseEntity.ok("✅ Amendment data fetch started asynchronously.");
    }

    @GetMapping("/{congress}")
    public ResponseEntity<String> fetchByCongress(@PathVariable int congress) {
        amendmentService.fetchAmendmentsByCongress(congress, 250, 0);
        return ResponseEntity.ok("✅ Amendments fetched for Congress " + congress);
    }

    @GetMapping("/{congress}/{type}")
    public ResponseEntity<String> fetchByType(
            @PathVariable int congress,
            @PathVariable String type
    ) {
        amendmentService.fetchAmendmentsByType(congress, type, 250, 0);
        return ResponseEntity.ok("✅ Amendments fetched for Congress " + congress + " Type " + type);
    }

    @GetMapping("/{congress}/{type}/{number}")
    public ResponseEntity<String> fetchDetails(
            @PathVariable int congress,
            @PathVariable String type,
            @PathVariable int number
    ) {
        amendmentService.fetchAmendmentDetails(congress, type, number);
        amendmentService.fetchAmendmentActions(congress, type, number);
        amendmentService.fetchAmendmentCosponsors(congress, type, number);
        amendmentService.fetchAmendmentText(congress, type, number);
        return ResponseEntity.ok("✅ Amendment " + number + " full data fetched successfully.");
    }
}
