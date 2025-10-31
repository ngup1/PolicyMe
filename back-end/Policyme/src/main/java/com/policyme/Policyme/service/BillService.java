package com.policyme.Policyme.service;

import com.policyme.Policyme.model.BillModel.BillResponse;
import com.policyme.Policyme.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.time.LocalDate;

@Service
public class BillService {
    private final WebClient webClient;
    private final BillRepository billRepository;

    @Value("${CONGRESS_GOV_API_KEY}")
    private String apiKey;

    private static final String fromDate = "2020-01-01";
    private final String toDate = LocalDate.now().toString();

    private final int[] congressSessions = {117, 118};
    private final String[] billTypes = {"hr", "s", "hjres", "sjres", "hres", "sres"};
    private final int billNumber = 7000;

    @Autowired
    public BillService(WebClient webClient, BillRepository billRepository) {
        this.webClient = webClient;
        this.billRepository = billRepository;
    }

    public void fetchAllBills(int limit, int offset) {
        String url = String.format(
                "/bill?format=json&limit=%d&offset=%d&fromDate=%s&toDate=%s&api_key=%s",
                limit, offset, fromDate, toDate, apiKey
        );
        fetchAndSave(url);
    }

    public void fetchBillsByCongress(int congress, int limit, int offset) {
        String url = String.format(
                "/bill/%d?format=json&limit=%d&offset=%d&fromDate=%s&toDate=%s&api_key=%s",
                congress, limit, offset, fromDate, toDate, apiKey
        );
        fetchAndSave(url);
    }

    public void fetchBillsByType(int congress, String billType, int limit, int offset) {
        String url = String.format(
                "/bill/%d/%s?format=json&limit=%d&offset=%d&fromDate=%s&toDate=%s&api_key=%s",
                congress, billType.toLowerCase(), limit, offset, fromDate, toDate, apiKey
        );
        fetchAndSave(url);
    }

    public void fetchBillDetails(int congress, String billType, int billNumber) {
        String url = String.format(
                "/bill/%d/%s/%d?format=json&fromDate=%s&toDate=%s&api_key=%s",
                congress, billType.toLowerCase(), billNumber, fromDate, toDate, apiKey
        );
        fetchAndSave(url);
    }

    private void fetchAndSave(String url) {
        try {
            BillResponse response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(BillResponse.class)
                    .block();

            if (response != null && response.getBills() != null && !response.getBills().isEmpty()) {
                billRepository.saveAll(response.getBills());
                System.out.printf("✅ Saved %d bills from URL: %s%n", response.getBills().size(), url);
            } else {
                System.out.println("⚠️ No bills found for request: " + url);
            }

        } catch (org.springframework.web.reactive.function.client.WebClientResponseException.NotFound e) {
            System.out.printf("⚠️ Skipped 404 for URL: %s%n", url);
        } catch (Exception e) {
            System.out.printf("❌ Error fetching URL: %s — %s%n", url, e.getMessage());
        }
    }


    public void fetchAllBillData() {
        for (int congress : congressSessions) {
            System.out.println("Starting Congress session: " + congress);
            for (String billType : billTypes) {
                System.out.println("Fetching bill type: " + billType.toUpperCase());
                var offset = 0;
                while (offset < 1000) {
                    fetchBillsByType(congress, billType, 250, offset);
                    offset += 250;
                }
                fetchBillDetails(congress, billType, billNumber);
            }
            System.out.println("Finished all bill types for Congress " + congress);
        }
        System.out.println("All data fetch loops completed successfully!");
    }
}
