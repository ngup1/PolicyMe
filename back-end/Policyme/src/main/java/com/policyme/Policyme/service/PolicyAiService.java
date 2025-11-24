package com.policyme.Policyme.service;

import com.policyme.Policyme.model.BillModel.Bill;
import com.policyme.Policyme.repository.BillRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

import java.util.Optional;

@Service
public class PolicyAiService {

    private final ChatClient chatClient;
    private final BillRepository billRepository;

    public PolicyAiService(ChatClient chatClient, BillRepository billRepository) {
        this.chatClient = chatClient;
        this.billRepository = billRepository;
    }

    public String ask(@NonNull String question) {
        try {
            return chatClient.prompt().user(question).call().content();
        } catch (Exception e) {
            return "AI call failed: " + e.getMessage();
        }
    }

    public String summarizeBill(@NonNull String billId) {
        Optional<Bill> bill = billRepository.findById(billId);
        if (bill.isEmpty()) {
            return "Bill not found: " + billId;
        }
        String context = buildBillContext(bill.get());
        String prompt = "Summarize the following U.S. bill for a general audience. Be concise (120-180 words) and neutral.\n\n" + context;
        try {
            return chatClient.prompt().user(prompt).call().content();
        } catch (Exception e) {
            return "AI summarization failed: " + e.getMessage();
        }
    }

    public String compareBills(@NonNull String billIdA, @NonNull String billIdB) {
        Optional<Bill> a = billRepository.findById(billIdA);
        Optional<Bill> b = billRepository.findById(billIdB);
        if (a.isEmpty() || b.isEmpty()) {
            return "One or both bills not found.";
        }
        String prompt = "Compare these two bills. Summarize key differences, scope, sponsors, and latest action. Keep it under 250 words.\n\n" +
                "Bill A:\n" + buildBillContext(a.get()) + "\n\nBill B:\n" + buildBillContext(b.get());
        try {
            return chatClient.prompt().user(prompt).call().content();
        } catch (Exception e) {
            return "AI comparison failed: " + e.getMessage();
        }
    }

    private String buildBillContext(Bill bill) {
        StringBuilder sb = new StringBuilder();
        sb.append("Title: ").append(nullToEmpty(bill.getTitle())).append('\n');
        sb.append("Number: ").append(nullToEmpty(bill.getNumber())).append('\n');
        sb.append("Type: ").append(nullToEmpty(bill.getType())).append('\n');
        sb.append("Congress: ").append(bill.getCongress()).append('\n');
        if (bill.getPolicyArea() != null) {
            sb.append("Policy Area: ").append(nullToEmpty(bill.getPolicyArea().getName())).append('\n');
        }
        sb.append("Origin Chamber: ").append(nullToEmpty(bill.getOriginChamber())).append('\n');
        if (bill.getLatestAction() != null) {
            sb.append("Latest Action: ").append(nullToEmpty(bill.getLatestAction().getText())).append(" on ")
                    .append(nullToEmpty(bill.getLatestAction().getActionDate())).append('\n');
        }
        if (bill.getSponsors() != null && !bill.getSponsors().isEmpty()) {
            sb.append("Sponsors: ");
            bill.getSponsors().stream().limit(3).forEach(s -> sb.append(s.getFullName()).append("; "));
            sb.append('\n');
        }
        sb.append("URL: ").append(nullToEmpty(bill.getUrl())).append('\n');
        return sb.toString();
    }

    private String nullToEmpty(String s) { return s == null ? "" : s; }
}
