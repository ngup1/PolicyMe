package com.policyme.Policyme.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class GpoService {

    private final RestTemplate restTemplate;

    @Value("${gpo.api.base-url}")
    private String baseUrl;

    @Value("${gpo.api.key:}")
    private String apiKey;

    public GpoService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }


    public Map<String, Object> search(String q) {
        // Congress.gov API format: https://api.congress.gov/v3/summaries?api_key=xxx&limit=10
        String url = String.format("%s?api_key=%s&limit=10", baseUrl, apiKey);
        if (q != null && !q.isBlank()) {
            url = url + "&query=" + java.net.URLEncoder.encode(q, java.nio.charset.StandardCharsets.UTF_8);
        }
        return restTemplate.getForObject(url, Map.class);
    }
}
