package com.policyme.Policyme.controller;

import com.policyme.Policyme.service.GpoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/gpo")
public class GpoController {

    private final GpoService gpoService;

    public GpoController(GpoService gpoService) {
        this.gpoService = gpoService;
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(@RequestParam String query) {
        Map<String, Object> result = gpoService.searchLegislation(query);
        return ResponseEntity.ok(result);
    }
}
