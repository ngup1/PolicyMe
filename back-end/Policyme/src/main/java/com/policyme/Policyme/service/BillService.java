package com.policyme.Policyme.service;


import com.policyme.Policyme.config.WebConfigClient;
import com.policyme.Policyme.model.BillModel.Bill;
import com.policyme.Policyme.model.BillModel.BillDetailResponse;
import com.policyme.Policyme.model.BillModel.BillResponse;
import com.policyme.Policyme.repository.BillRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.policyme.Policyme.model.BillModel.Bill;
import java.time.LocalDate;
@Service
public class BillService {

    private final WebClient webClient;
    private final BillRepository billRepository;

    @Value("${CONGRESS_GOV_API_KEY}")
    private String apiKey;

    public BillService(WebClient webClient, BillRepository billRepository) {
        this.webClient = webClient;
        this.billRepository = billRepository;
    }

    // Fetch all bills (default)
    public void fetchAllBills(int limit, int offset) {
        String url = String.format("/bill?format=json&limit=%d&offset=%d&api_key=%s",
                limit, offset, apiKey);

        fetchAndSave(url);
    }


    //  Fetch by congress (e.g. 117th)

    public void fetchBillsByCongress(int congress, int limit, int offset) {
        String url = String.format("/bill/%d?format=json&limit=%d&offset=%d&api_key=%s",
                congress, limit, offset, apiKey);

        fetchAndSave(url);
    }


    // Fetch by congress + billType (e.g. HR, S, HRES)

    public void fetchBillsByType(int congress, String billType, int limit, int offset) {
        String url = String.format("/bill/%d/%s?format=json&limit=%d&offset=%d&api_key=%s",
                congress, billType.toLowerCase(), limit, offset, apiKey);

        fetchAndSave(url);
    }


    //Fetch by specific bill number (detailed info)

    public Bill fetchBillDetails(int congress, String billType, int billNumber) {
        String url = String.format("/bill/%d/%s/%d?format=json&api_key=%s",
                congress, billType.toLowerCase(), billNumber, apiKey);

        BillDetailResponse response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(BillDetailResponse.class)
                .block();

        if (response != null && response.getBill() != null) {
            billRepository.save(response.getBill());
            return response.getBill();
        }

        return null;
    }


    // Helper for shared logic
    private void fetchAndSave(String url) {
        BillResponse response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(BillResponse.class)
                .block();

        if (response != null && response.getBills() != null) {
            billRepository.saveAll(response.getBills());
            System.out.println("✅ Saved " + response.getBills().size() + " bills.");
        } else {
            System.out.println("⚠️ No bills found for " + url);
        }
    }


    public void fetchAlBillData() {
        int[] congressSessions = {117, 118}; // or fetch dynamically later
        String[] billTypes = {"hr", "s", "hjres", "sjres", "hres", "sres"};
        String fromDate = "2020-01-01";



        for (int congress : congressSessions) {

            System.out.println(" Starting Congress session: " + congress);


            for (String billType : billTypes) {
                System.out.println("Fetching bill type: " + billType.toUpperCase());

                int offset = 0;
                int maxBills = 1000;

                while (offset < maxBills) {
                    String url = String.format(
                            "/bill/%d/%s?format=json&limit=250&offset=%d&fromDate=%s&toDate=%s&api_key=%s",
                            congress,
                            billType,
                            offset,
                            fromDate,
                            LocalDate.now().toString(),
                            apiKey
                    );

                    System.out.printf("🌐 [Request] Congress=%d | Type=%s | Offset=%d | Time=%s%n",
                            congress, billType, offset, java.time.LocalTime.now());
                    System.out.println("🔗 URL: " + url);

                    BillResponse response = webClient.get()
                            .uri(url)
                            .retrieve()
                            .bodyToMono(BillResponse.class)
                            .block();

                    if (response == null || response.getBills() == null || response.getBills().isEmpty()) {
                        System.out.printf("No more bills found for Congress %d (%s) at offset %d%n",
                                congress, billType, offset);
                        break;
                    }

                    billRepository.saveAll(response.getBills());
                    offset += 250;

                    System.out.printf("Saved %d bills from Congress %d (%s) [Total offset now %d]%n",
                            response.getBills().size(), congress, billType, offset);
                }

                System.out.printf("Completed fetching all bills for type '%s' in Congress %d%n",
                        billType.toUpperCase(), congress);
            }

            System.out.println("Finished all bill types for Congress" + congress);
        }

        System.out.println("All data fetch loops completed successfully!");
    }

}
