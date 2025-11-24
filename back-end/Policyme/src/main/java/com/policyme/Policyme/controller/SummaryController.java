package com.policyme.Policyme.controller;

import com.policyme.Policyme.model.SummariesModel.Summary;
import com.policyme.Policyme.repository.SummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/summaries")
@CrossOrigin(origins = "*")
public class SummaryController {

    @Autowired
    private SummaryRepository summaryRepository;

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getSummaryCount() {
        long count = summaryRepository.count();
        return ResponseEntity.ok(Map.of("count", count));
    }

    @GetMapping
    public ResponseEntity<List<Summary>> getAllSummaries(
            @RequestParam(defaultValue = "10") int limit
    ) {
        List<Summary> summaries = summaryRepository.findAll()
                .stream()
                .limit(limit)
                .toList();
        return ResponseEntity.ok(summaries);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Summary> getSummaryById(@PathVariable String id) {
        return summaryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
