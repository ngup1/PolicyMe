package com.policyme.Policyme.controller;

import com.policyme.Policyme.model.AmendmentModel.Amendment;
import com.policyme.Policyme.repository.AmendmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/amendments")
@CrossOrigin(origins = "*")
public class AmendmentController {

    @Autowired
    private AmendmentRepository amendmentRepository;

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getAmendmentCount() {
        long count = amendmentRepository.count();
        return ResponseEntity.ok(Map.of("count", count));
    }

    @GetMapping
    public ResponseEntity<List<Amendment>> getAllAmendments(
            @RequestParam(defaultValue = "10") int limit
    ) {
        List<Amendment> amendments = amendmentRepository.findAll()
                .stream()
                .limit(limit)
                .toList();
        return ResponseEntity.ok(amendments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Amendment> getAmendmentById(@PathVariable String id) {
        return amendmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
