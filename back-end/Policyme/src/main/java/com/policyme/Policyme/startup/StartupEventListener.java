package com.policyme.Policyme.startup;


import com.policyme.Policyme.service.BillService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class StartupEventListener {
    public final BillService billService;


    public StartupEventListener(BillService billService) {
        this.billService = billService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationRead() {
        billService.fetchAlBillData();
    }
}
