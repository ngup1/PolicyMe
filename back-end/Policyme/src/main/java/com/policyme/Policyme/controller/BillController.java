package com.policyme.Policyme.controller;

import com.policyme.Policyme.model.BillModel.Bill;
import com.policyme.Policyme.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "*")
public class BillController {

    @Autowired
    private BillRepository billRepository;

    /**
     * Get count of bills in database
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getBillCount() {
        long count = billRepository.count();
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * Get all bills (with limit)
     */
    @GetMapping
    public ResponseEntity<List<Bill>> getAllBills(
            @RequestParam(defaultValue = "10") int limit
    ) {
        List<Bill> bills = billRepository.findAll()
                .stream()
                .limit(limit)
                .toList();
        return ResponseEntity.ok(bills);
    }

    /**
     * Get bill by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable String id) {
        return billRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Health check
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "database", "congressDB",
                "collection", "bills"
        ));
    }
}
