package com.policyme.Policyme.startup;


import com.policyme.Policyme.service.BillService;
import com.policyme.Policyme.service.SummaryService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Profile("!test")
@Component
public class StartupEventListener {
    public final BillService billService;
    public final SummaryService summaryService;


    public StartupEventListener(BillService billService, SummaryService summaryService) {
        this.billService = billService;
        this.summaryService = summaryService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        CompletableFuture<Void> bills = billService.fetchAllBillDataAsync();
        CompletableFuture<Void> summaries = summaryService.fetchAllSummaryDataAsync();
        CompletableFuture.allOf(bills, summaries).join();
        System.out.println("Completed both Summary and Bill");

    }
}
