package com.policyme.Policyme.service;

import com.policyme.Policyme.repository.SummaryRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertTrue;

@AutoConfigureMockMvc(addFilters = false)
@SpringBootTest
@ActiveProfiles("test")
class SummaryServiceIntegrationTest {

    @Autowired
    private SummaryService summaryService;

    @Autowired
    private SummaryRepository summaryRepository;

    @AfterEach
    void tearDown() {
        summaryRepository.deleteAll();
    }

    @Test
    void fetchAllSummaries_savesData() {
        summaryService.fetchAllSummaries(100, 0);
        assertTrue(summaryRepository.count() > 0);
    }

    @Test
    void fetchSummariesByCongress_savesData() {
        summaryService.fetchSummariesByCongress(117, 100, 0);
        assertTrue(summaryRepository.count() > 0);
    }

    @Test
    void fetchSummariesByCongressAndBillType_savesData() {
        summaryService.fetchSummariesByCongressAndBillType(117, "hr", 100, 0);
        assertTrue(summaryRepository.count() > 0);
    }
}
