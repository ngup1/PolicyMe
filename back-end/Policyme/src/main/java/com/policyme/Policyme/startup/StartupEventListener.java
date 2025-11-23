package com.policyme.Policyme.startup;

import com.policyme.Policyme.service.BillService;
import com.policyme.Policyme.service.SummaryService;
import com.policyme.Policyme.service.AmendmentService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Profile("!test")
@Component
public class StartupEventListener {
    private final BillService billService;
    private final SummaryService summaryService;
    private final AmendmentService amendmentService;

    public StartupEventListener(BillService billService,
                                SummaryService summaryService,
                                AmendmentService amendmentService) {
        this.billService = billService;
        this.summaryService = summaryService;
        this.amendmentService = amendmentService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        CompletableFuture<Void> bills = billService.fetchAllBillDataAsync();
        CompletableFuture<Void> summaries = summaryService.fetchAllSummaryDataAsync();
        CompletableFuture<Void> amendments = amendmentService.fetchAllAmendmentDataAsync();

        CompletableFuture.allOf(bills, summaries, amendments).join();

        System.out.println("✅ Completed Bill, Summary, and Amendment data fetch!");
    }
}