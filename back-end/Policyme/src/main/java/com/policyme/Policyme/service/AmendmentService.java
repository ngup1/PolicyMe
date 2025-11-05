package com.policyme.Policyme.service;

import com.policyme.Policyme.model.AmendmentModel.Amendment;
import com.policyme.Policyme.repository.AmendmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class AmendmentService {

    private final WebClient webClient;
    private final AmendmentRepository amendmentRepository;

    @Value("${CONGRESS_GOV_API_KEY}")
    private String apiKey;

    private static final String fromDate = LocalDate.now().minusYears(5).toString();
    private final String toDate = LocalDate.now().toString();

    // Example: 117th, 118th, 119th Congress sessions
    private final int[] congressSessions = {117, 118, 119};

    // Common amendment types used in the API
    private final String[] amendmentTypes = {"hamdt", "samdt"};

    // Example amendment number for detailed requests
    private final int sampleAmendmentNumber = 287;

    @Autowired
    public AmendmentService(WebClient webClient, AmendmentRepository amendmentRepository) {
        this.webClient = webClient;
        this.amendmentRepository = amendmentRepository;
    }

    /** ============================
     *      FETCH METHODS
     * ============================ */

    public void fetchAllAmendments(int limit, int offset) {
        String url = String.format(
                "/amendment?format=json&limit=%d&offset=%d&fromDate=%s&toDate=%s&api_key=%s",
                limit, offset, fromDate, toDate, apiKey
        );
        fetchAndSave(url);
    }

    public void fetchAmendmentsByCongress(int congress, int limit, int offset) {
        String url = String.format(
                "/amendment/%d?format=json&limit=%d&offset=%d&fromDate=%s&toDate=%s&api_key=%s",
                congress, limit, offset, fromDate, toDate, apiKey
        );
        fetchAndSave(url);
    }

    public void fetchAmendmentsByType(int congress, String amendmentType, int limit, int offset) {
        String url = String.format(
                "/amendment/%d/%s?format=json&limit=%d&offset=%d&fromDate=%s&toDate=%s&api_key=%s",
                congress, amendmentType.toLowerCase(), limit, offset, fromDate, toDate, apiKey
        );
        fetchAndSave(url);
    }

    public void fetchAmendmentDetails(int congress, String amendmentType, int amendmentNumber) {
        String url = String.format(
                "/amendment/%d/%s/%d?format=json&api_key=%s",
                congress, amendmentType.toLowerCase(), amendmentNumber, apiKey
        );
        fetchAndSave(url);
    }

    public void fetchAmendmentActions(int congress, String amendmentType, int amendmentNumber) {
        String url = String.format(
                "/amendment/%d/%s/%d/actions?format=json&api_key=%s",
                congress, amendmentType.toLowerCase(), amendmentNumber, apiKey
        );
        fetchAndLogOnly(url);
    }

    public void fetchAmendmentCosponsors(int congress, String amendmentType, int amendmentNumber) {
        String url = String.format(
                "/amendment/%d/%s/%d/cosponsors?format=json&api_key=%s",
                congress, amendmentType.toLowerCase(), amendmentNumber, apiKey
        );
        fetchAndLogOnly(url);
    }

    public void fetchAmendmentText(int congress, String amendmentType, int amendmentNumber) {
        String url = String.format(
                "/amendment/%d/%s/%d/text?format=json&api_key=%s",
                congress, amendmentType.toLowerCase(), amendmentNumber, apiKey
        );
        fetchAndLogOnly(url);
    }

    /** ============================
     *      HELPER METHODS
     * ============================ */

    private void fetchAndSave(String url) {
        try {
            Map<?, ?> response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("amendments")) {
                List<Amendment> amendments = (List<Amendment>) response.get("amendments");
                if (amendments != null && !amendments.isEmpty()) {
                    amendmentRepository.saveAll(amendments);
                    System.out.printf("✅ Saved %d amendments from URL: %s%n", amendments.size(), url);
                } else {
                    System.out.println("⚠️ No amendments found for request: " + url);
                }
            } else {
                System.out.println("⚠️ No valid 'amendments' field found in response for: " + url);
            }

        } catch (org.springframework.web.reactive.function.client.WebClientResponseException.NotFound e) {
            System.out.printf("⚠️ Skipped 404 for URL: %s%n", url);
        } catch (Exception e) {
            System.out.printf("❌ Error fetching amendments from %s — %s%n", url, e.getMessage());
        }
    }

    // Used for endpoints like /actions, /cosponsors, /text — only logs
    private void fetchAndLogOnly(String url) {
        try {
            Object response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(Object.class)
                    .block();

            System.out.printf("ℹ️ Data fetched successfully from: %s%n", url);
        } catch (org.springframework.web.reactive.function.client.WebClientResponseException.NotFound e) {
            System.out.printf("⚠️ No data (404) for: %s%n", url);
        } catch (Exception e) {
            System.out.printf("❌ Error fetching: %s — %s%n", url, e.getMessage());
        }
    }

    /** ============================
     *      FULL DATA LOOP
     * ============================ */

    public void fetchAllAmendmentData() {
        for (int congress : congressSessions) {
            System.out.println("📘 Starting Amendment fetch for Congress: " + congress);
            for (String amendmentType : amendmentTypes) {
                System.out.println("🔹 Fetching type: " + amendmentType.toUpperCase());

                int offset = 0;
                while (offset < 1000) {
                    fetchAmendmentsByType(congress, amendmentType, 250, offset);
                    fetchAmendmentsByCongress(congress, 250, offset);
                    fetchAllAmendments(250, offset);
                    offset += 250;
                }

                // Fetch sample details for demonstration/logging
                fetchAmendmentDetails(congress, amendmentType, sampleAmendmentNumber);
                fetchAmendmentActions(congress, amendmentType, sampleAmendmentNumber);
                fetchAmendmentCosponsors(congress, amendmentType, sampleAmendmentNumber);
                fetchAmendmentText(congress, amendmentType, sampleAmendmentNumber);
            }
            System.out.println("✅ Finished all amendment types for Congress " + congress);
        }
        System.out.println("🎯 All amendment data fetch loops completed successfully!");
    }

    @Async
    public CompletableFuture<Void> fetchAllAmendmentDataAsync() {
        fetchAllAmendmentData();
        return CompletableFuture.completedFuture(null);
    }
}

