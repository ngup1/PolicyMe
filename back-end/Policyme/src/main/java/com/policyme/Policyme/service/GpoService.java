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
        String url = String.format("%s/search?q=%s", baseUrl, q);
        if (apiKey != null && !apiKey.isBlank()) {
            url = url + "&api_key=" + apiKey;
        }
        return restTemplate.getForObject(url, Map.class);
    }
}
