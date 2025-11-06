package com.policyme.Policyme.controller;

import com.policyme.Policyme.service.CongressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/congress")
@CrossOrigin(origins = "http://localhost:3000")
public class CongressController {

    private final CongressService congressService;

    public CongressController(CongressService congressService) {
        this.congressService = congressService;
    }

    @GetMapping("/bill")
    public ResponseEntity<Map<String, Object>> getBills(
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset) {
        Map<String, Object> result = congressService.getBills(limit, offset);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/bill/{congress}")
    public ResponseEntity<Map<String, Object>> getBillsByCongress(
            @PathVariable Integer congress,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset) {
        Map<String, Object> result = congressService.getBillsByCongress(congress, limit, offset);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/bill/{congress}/{billType}")
    public ResponseEntity<Map<String, Object>> getBillsByType(
            @PathVariable Integer congress,
            @PathVariable String billType,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset) {
        Map<String, Object> result = congressService.getBillsByType(congress, billType, limit, offset);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/bill/{congress}/{billType}/{billNumber}")
    public ResponseEntity<Map<String, Object>> getBillDetails(
            @PathVariable Integer congress,
            @PathVariable String billType,
            @PathVariable String billNumber) {
        Map<String, Object> result = congressService.getBillDetails(congress, billType, billNumber);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/bill/{congress}/{billType}/{billNumber}/actions")
    public ResponseEntity<Map<String, Object>> getBillActions(
            @PathVariable Integer congress,
            @PathVariable String billType,
            @PathVariable String billNumber,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset) {
        Map<String, Object> result = congressService.getBillActions(congress, billType, billNumber, limit, offset);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/bill/{congress}/{billType}/{billNumber}/amendments")
    public ResponseEntity<Map<String, Object>> getBillAmendments(
            @PathVariable Integer congress,
            @PathVariable String billType,
            @PathVariable String billNumber,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset) {
        Map<String, Object> result = congressService.getBillAmendments(congress, billType, billNumber, limit, offset);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/bill/{congress}/{billType}/{billNumber}/committees")
    public ResponseEntity<Map<String, Object>> getBillCommittees(
            @PathVariable Integer congress,
            @PathVariable String billType,
            @PathVariable String billNumber) {
        Map<String, Object> result = congressService.getBillCommittees(congress, billType, billNumber);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/bill/{congress}/{billType}/{billNumber}/cosponsors")
    public ResponseEntity<Map<String, Object>> getBillCosponsors(
            @PathVariable Integer congress,
            @PathVariable String billType,
            @PathVariable String billNumber,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset) {
        Map<String, Object> result = congressService.getBillCosponsors(congress, billType, billNumber, limit, offset);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/bill/{congress}/{billType}/{billNumber}/relatedbills")
    public ResponseEntity<Map<String, Object>> getRelatedBills(
            @PathVariable Integer congress,
            @PathVariable String billType,
            @PathVariable String billNumber) {
        Map<String, Object> result = congressService.getRelatedBills(congress, billType, billNumber);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/bill/{congress}/{billType}/{billNumber}/subjects")
    public ResponseEntity<Map<String, Object>> getBillSubjects(
            @PathVariable Integer congress,
            @PathVariable String billType,
            @PathVariable String billNumber) {
        Map<String, Object> result = congressService.getBillSubjects(congress, billType, billNumber);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/bill/{congress}/{billType}/{billNumber}/summaries")
    public ResponseEntity<Map<String, Object>> getBillSummaries(
            @PathVariable Integer congress,
            @PathVariable String billType,
            @PathVariable String billNumber) {
        Map<String, Object> result = congressService.getBillSummaries(congress, billType, billNumber);
        return ResponseEntity.ok(result);
    }
}

