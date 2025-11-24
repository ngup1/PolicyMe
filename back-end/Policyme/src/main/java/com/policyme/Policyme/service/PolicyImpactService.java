package com.policyme.Policyme.service;

import com.policyme.Policyme.dto.Demographics;
import com.policyme.Policyme.model.BillModel.Bill;
import com.policyme.Policyme.repository.BillRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

import java.util.Optional;

@Service
public class PolicyImpactService {

    private final ChatClient chatClient;
    private final BillRepository billRepository;

    public PolicyImpactService(ChatClient chatClient, BillRepository billRepository) {
        this.chatClient = chatClient;
        this.billRepository = billRepository;
    }

    public String explainImpact(@NonNull String billId, @NonNull Demographics demo) {
        Optional<Bill> bill = billRepository.findById(billId);
        if (bill.isEmpty()) {
            return "Bill not found: " + billId;
        }
        String context = new StringBuilder()
                .append("Bill Context\n").append(buildBillContext(bill.get())).append("\n")
                .append("User Demographics\n")
                .append("Age: ").append(demo.getAge()).append("\n")
                .append("State: ").append(nullToEmpty(demo.getState())).append("\n")
                .append("Income: ").append(nullToEmpty(demo.getIncomeBracket())).append("\n")
                .append("Veteran: ").append(Boolean.TRUE.equals(demo.getVeteran())).append("\n")
                .append("Student: ").append(Boolean.TRUE.equals(demo.getStudent())).append("\n")
                .append("Small Business Owner: ").append(Boolean.TRUE.equals(demo.getSmallBusinessOwner())).append("\n")
                .toString();

        String prompt = "Explain concretely how the above bill could impact someone with these demographics. " +
                "Focus on eligibility, benefits, costs, taxes, timelines, and actions they might take. " +
                "Be specific and avoid speculation. Use 120-200 words.\n\n" + context;
        try {
            return chatClient.prompt().user(prompt).call().content();
        } catch (Exception e) {
            return "AI impact explanation failed: " + e.getMessage();
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
        if (bill.getLatestAction() != null) {
            sb.append("Latest Action: ").append(nullToEmpty(bill.getLatestAction().getText())).append(" on ")
                    .append(nullToEmpty(bill.getLatestAction().getActionDate())).append('\n');
        }
        return sb.toString();
    }

    private String nullToEmpty(String s) { return s == null ? "" : s; }
}
