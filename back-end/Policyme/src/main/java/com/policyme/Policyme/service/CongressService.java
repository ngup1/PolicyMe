package com.policyme.Policyme.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class CongressService {

    private final RestTemplate restTemplate;

    @Value("${congress.api.base-url:https://api.congress.gov}")
    private String baseUrl;
    
    private static final String API_VERSION = "/v3";

    @Value("${congress.api.key:}")
    private String apiKey;

    public CongressService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Get a list of bills sorted by date of latest action
     */
    public Map<String, Object> getBills(Integer limit, Integer offset) {
        String url = buildUrl("/bill", limit, offset);
        return restTemplate.getForObject(url, Map.class);
    }

    /**
     * Get bills for a specific congress
     */
    public Map<String, Object> getBillsByCongress(Integer congress, Integer limit, Integer offset) {
        String url = buildUrl("/bill/" + congress, limit, offset);
        return restTemplate.getForObject(url, Map.class);
    }

    /**
     * Get bills by congress and type (e.g., HR, S, HRES, etc.)
     */
    public Map<String, Object> getBillsByType(Integer congress, String billType, Integer limit, Integer offset) {
        String url = buildUrl("/bill/" + congress + "/" + billType, limit, offset);
        return restTemplate.getForObject(url, Map.class);
    }

    /**
     * Get detailed information for a specific bill
     */
    public Map<String, Object> getBillDetails(Integer congress, String billType, String billNumber) {
        String url = buildUrl("/bill/" + congress + "/" + billType + "/" + billNumber, null, null);
        return restTemplate.getForObject(url, Map.class);
    }

    /**
     * Get actions for a specific bill
     */
    public Map<String, Object> getBillActions(Integer congress, String billType, String billNumber, Integer limit, Integer offset) {
        String url = buildUrl("/bill/" + congress + "/" + billType + "/" + billNumber + "/actions", limit, offset);
        return restTemplate.getForObject(url, Map.class);
    }

    /**
     * Get amendments for a specific bill
     */
    public Map<String, Object> getBillAmendments(Integer congress, String billType, String billNumber, Integer limit, Integer offset) {
        String url = buildUrl("/bill/" + congress + "/" + billType + "/" + billNumber + "/amendments", limit, offset);
        return restTemplate.getForObject(url, Map.class);
    }

    /**
     * Get committees associated with a specific bill
     */
    public Map<String, Object> getBillCommittees(Integer congress, String billType, String billNumber) {
        String url = buildUrl("/bill/" + congress + "/" + billType + "/" + billNumber + "/committees", null, null);
        return restTemplate.getForObject(url, Map.class);
    }

    /**
     * Get cosponsors for a specific bill
     */
    public Map<String, Object> getBillCosponsors(Integer congress, String billType, String billNumber, Integer limit, Integer offset) {
        String url = buildUrl("/bill/" + congress + "/" + billType + "/" + billNumber + "/cosponsors", limit, offset);
        return restTemplate.getForObject(url, Map.class);
    }

    /**
     * Get related bills for a specific bill
     */
    public Map<String, Object> getRelatedBills(Integer congress, String billType, String billNumber) {
        String url = buildUrl("/bill/" + congress + "/" + billType + "/" + billNumber + "/relatedbills", null, null);
        return restTemplate.getForObject(url, Map.class);
    }

    /**
     * Get subjects for a specific bill
     */
    public Map<String, Object> getBillSubjects(Integer congress, String billType, String billNumber) {
        String url = buildUrl("/bill/" + congress + "/" + billType + "/" + billNumber + "/subjects", null, null);
        return restTemplate.getForObject(url, Map.class);
    }

    /**
     * Get summaries for a specific bill
     */
    public Map<String, Object> getBillSummaries(Integer congress, String billType, String billNumber) {
        String url = buildUrl("/bill/" + congress + "/" + billType + "/" + billNumber + "/summaries", null, null);
        return restTemplate.getForObject(url, Map.class);
    }

    /**
     * Build the URL with API key and optional pagination parameters
     */
    private String buildUrl(String endpoint, Integer limit, Integer offset) {
        StringBuilder url = new StringBuilder(baseUrl + API_VERSION + endpoint);
        
        boolean hasParams = false;
        
        if (limit != null) {
            url.append("?limit=").append(limit);
            hasParams = true;
        }
        
        if (offset != null) {
            url.append(hasParams ? "&" : "?").append("offset=").append(offset);
            hasParams = true;
        }
        
        if (apiKey != null && !apiKey.isBlank()) {
            url.append(hasParams ? "&" : "?").append("api_key=").append(apiKey);
        }
        
        return url.toString();
    }
}

