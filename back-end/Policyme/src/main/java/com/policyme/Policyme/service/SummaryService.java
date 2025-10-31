package com.policyme.Policyme.service;

import com.policyme.Policyme.repository.SummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

@Service
public class SummaryService {

    private final WebClient webClient;
    private final SummaryRepository summaryRepository;

    @Value("${CONGRESS_GOV_API_KEY}")
    private String apiKey;
    private String fromDateTime = "2020-01-01T00:00:00Z";
    String toDateTime = nowUTC();


    public static String nowUTC() {
        return DateTimeFormatter.ISO_INSTANT
                .format(Instant.now().atOffset(ZoneOffset.UTC));
    }

    @Autowired
    public SummaryService(WebClient webClient, SummaryRepository summaryRepository) {
        this.webClient = webClient;
        this.summaryRepository = summaryRepository;
    }


    public void fetchAllSummaries(int limit, int offset) {
        String url = String.format(
                "/summaries?format=json&limit=%d&offset=%d&sort=updateDate+desc&api_key=%s",
                limit, offset, this.fromDateTime, toDateTime,apiKey
        );

        System.out.println("📄 Fetching all summaries → " + url);
        fetchAndSave(url);
    }


    public void fetchSummariesByCongress(int congress, int limit, int offset) {

        String url = String.format(
                "/summaries/%d?format=json&limit=%d&offset=%d&sort=updateDate+desc&api_key=%s",
                congress, limit, offset, this.fromDateTime, this.toDateTime,apiKey
        );

        fetchAndSave(url);
    }

    public void fetchSummariesByCongressAndBillType(int congress, String billType, int limit, int offset) {


        String url = String.format(
                "/summaries/%d/%s?format=json&limit=%d&offset=%d&fromDateTime=%s&toDateTime=%s&sort=updateDate+desc&api_key=%s",
                congress, billType, limit, offset, this.fromDateTime, this.toDateTime, apiKey
        );

        System.out.println("📄 Fetching summaries for Congress " + congress + " (" + billType + ") → " + url);
        fetchAndSave(url);
    }


    private void fetchAndSave(String url) {
        // TODO: Implement API call, parse SummaryResponse, and save via summaryRepository
    }
}
