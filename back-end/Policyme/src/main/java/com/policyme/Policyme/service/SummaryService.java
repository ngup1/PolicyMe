package com.policyme.Policyme.service;

import com.policyme.Policyme.model.BillModel.BillResponse;
import com.policyme.Policyme.model.SummariesModel.SummaryResponse;
import com.policyme.Policyme.repository.SummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.concurrent.CompletableFuture;


@RequiredArgsConstructor
@Service
public class SummaryService {

    private final WebClient webClient;
    private final SummaryRepository summaryRepository;

        @Value("${CONGRESS_GOV_API_KEY}")
        String apiKey;
    private final String fromDateTime = LocalDate.now().minusYears(5).toString() + "T00:00:00Z";
    private final String toDateTime = LocalDate.now().toString() + "T23:59:59Z";


    private final int[] congressSessions = {117,118};
    private final String[] billTypes = {"hr", "s", "hjres", "sjres", "hres", "sres"};




    public void fetchAllSummaries(int limit, int offset) {
        String url = String.format(
                "/summaries?format=json&limit=%d&offset=%d&fromDateTime=%s&toDateTime=%s&sort=updateDate+desc&api_key=%s",
                limit, offset, fromDateTime, toDateTime, apiKey
        );
        fetchAndSave(url);
    }

    public void fetchSummariesByCongress(int congress, int limit, int offset) {
        String url = String.format(
                "/summaries/%d?format=json&limit=%d&offset=%d&fromDateTime=%s&toDateTime=%s&sort=updateDate+desc&api_key=%s",
                congress, limit, offset, fromDateTime, toDateTime, apiKey
        );
        fetchAndSave(url);
    }

    public void fetchSummariesByCongressAndBillType(int congress, String billType, int limit, int offset) {
        String url = String.format(
                "/summaries/%d/%s?format=json&limit=%d&offset=%d&fromDateTime=%s&toDateTime=%s&sort=updateDate+desc&api_key=%s",
                congress, billType, limit, offset, fromDateTime, toDateTime, apiKey
        );
        fetchAndSave(url);
    }

    private void fetchAndSave(String url){
        try {
            SummaryResponse response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(SummaryResponse.class)
                    .block();

            if (response != null && response.getSummaries() != null && !response.getSummaries().isEmpty()) {
                summaryRepository.saveAll(response.getSummaries());
                System.out.printf("✅ Saved %d bills from URL: %s%n", response.getSummaries().size(), url);
            } else {
                System.out.println("⚠️ No bills found for request: " + url);
            }

        } catch (org.springframework.web.reactive.function.client.WebClientResponseException.NotFound e) {
            System.out.printf("⚠️ Skipped 404 for URL: %s%n", url);
        } catch (Exception e) {
            System.out.printf("❌ Error fetching URL: %s — %s%n", url, e.getMessage());
        }

    }


    public void fetchAllSummaryData() {
        for (int congress : congressSessions) {
            System.out.println("Starting Congress session: " + congress);
            for (String billType : billTypes) {
                System.out.println("Fetching bill type: " + billType.toUpperCase());
                var offset = 0;
                while (offset < 1000) {
                    fetchSummariesByCongressAndBillType(congress, billType, 250, offset);
                    fetchSummariesByCongress(congress, 250, offset);
                    fetchAllSummaries(250, offset);
                    offset += 250;
                }
            }
            System.out.println("Finished all bill types for Congress " + congress);
        }
        System.out.println("All data fetch loops completed successfully!");
    }


    @Async
    public CompletableFuture<Void> fetchAllSummaryDataAsync() {
        fetchAllSummaryData();
        return CompletableFuture.completedFuture(null);
    }
}



