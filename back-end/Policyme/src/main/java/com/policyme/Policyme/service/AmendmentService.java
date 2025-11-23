package com.policyme.Policyme.service;

import com.policyme.Policyme.model.AmendmentModel.Amendment;
import com.policyme.Policyme.repository.AmendmentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.time.LocalDate;
import java.util.concurrent.CompletableFuture;

@Service
public class AmendmentService {

    private final WebClient webClient;
    private final AmendmentRepository amendmentRepository;

    @Value("${CONGRESS_GOV_API_KEY}")
    private String apiKey;

    private static final String fromDate = LocalDate.now().minusYears(5).toString();
    private final String toDate = LocalDate.now().toString();

    private final int[] congressSessions = {117, 118};
    private final String[] amendmentTypes = {"hamdt", "samdt"};
    private final int sampleAmendmentNumber = 300;

    public AmendmentService(WebClient webClient, AmendmentRepository amendmentRepository) {
        this.webClient = webClient;
        this.amendmentRepository = amendmentRepository;
    }

    private void fetchAndSave(String url) {
        try {
            Amendment response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(Amendment.class)
                    .block();

            if (response != null) {
                amendmentRepository.save(response);
                System.out.printf("✅ Saved amendment data from URL: %s%n", url);
            } else {
                System.out.printf("⚠️ No amendment data found for: %s%n", url);
            }

        } catch (org.springframework.web.reactive.function.client.WebClientResponseException.NotFound e) {
            System.out.printf("⚠️ No data (404) for: %s%n", url);
        } catch (Exception e) {
            System.out.printf("❌ Error fetching: %s — %s%n", url, e.getMessage());
        }
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
        fetchAndSave(url);
    }

    public void fetchAmendmentCosponsors(int congress, String amendmentType, int amendmentNumber) {
        String url = String.format(
                "/amendment/%d/%s/%d/cosponsors?format=json&api_key=%s",
                congress, amendmentType.toLowerCase(), amendmentNumber, apiKey
        );
        fetchAndSave(url);
    }

    public void fetchAmendmentText(int congress, String amendmentType, int amendmentNumber) {
        String url = String.format(
                "/amendment/%d/%s/%d/text?format=json&api_key=%s",
                congress, amendmentType.toLowerCase(), amendmentNumber, apiKey
        );
        fetchAndSave(url);
    }

    public void fetchAllAmendmentData() {
        for (int congress : congressSessions) {
            System.out.println("Starting Congress session: " + congress);
            for (String amendmentType : amendmentTypes) {
                System.out.println("Fetching amendment type: " + amendmentType.toUpperCase());
                int offset = 0;
                while (offset < 1000) {
                    fetchAmendmentsByType(congress, amendmentType, 250, offset);
                    fetchAmendmentsByCongress(congress, 250, offset);
                    offset += 250;
                }
                fetchAmendmentDetails(congress, amendmentType, sampleAmendmentNumber);
                fetchAmendmentActions(congress, amendmentType, sampleAmendmentNumber);
                fetchAmendmentCosponsors(congress, amendmentType, sampleAmendmentNumber);

            }
            System.out.println("Finished all amendment types for Congress " + congress);
        }
        System.out.println("All amendment data fetch loops completed successfully!");
    }

    @Async
    public CompletableFuture<Void> fetchAllAmendmentDataAsync() {
        fetchAllAmendmentData();
        return CompletableFuture.completedFuture(null);
    }
}
