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
        
        String billContext = buildBillContext(bill.get());
        String demographicProfile = buildDemographicProfile(demo);
        String relevantCategories = identifyRelevantCategories(demo);
        
        String prompt = buildPersonalizedImpactPrompt(billContext, demographicProfile, relevantCategories);
        
        try {
            return chatClient.prompt().user(prompt).call().content();
        } catch (Exception e) {
            return "AI impact explanation failed: " + e.getMessage();
        }
    }

    private String buildPersonalizedImpactPrompt(String billContext, String demographicProfile, String relevantCategories) {
        return new StringBuilder()
                .append("BILL INFORMATION:\n")
                .append(billContext).append("\n\n")
                .append("USER PROFILE:\n")
                .append(demographicProfile).append("\n\n")
                .append("RELEVANT IMPACT CATEGORIES:\n")
                .append(relevantCategories).append("\n\n")
                .append("TASK: Generate a personalized impact report analyzing how this bill would specifically affect this user.\n\n")
                .append("REPORT STRUCTURE:\n")
                .append("1. Direct Impact: How this bill directly affects the user's situation\n")
                .append("2. Financial Impact: Tax changes, costs, benefits, subsidies, or fee effects\n")
                .append("3. Eligibility & Timeline: Whether the user qualifies, when changes take effect\n")
                .append("4. Action Items: Specific steps the user should consider taking\n")
                .append("5. Risks & Opportunities: Potential downsides and benefits unique to this user\n\n")
                .append("Keep the analysis concrete, data-driven, and avoid speculation. Use 250-400 words.\n")
                .toString();
    }

    private String buildDemographicProfile(Demographics demo) {
        StringBuilder sb = new StringBuilder();
        if (demo.getAge() != null) {
            sb.append("• Age: ").append(demo.getAge()).append(" years old\n");
        }
        if (demo.getState() != null && !demo.getState().isEmpty()) {
            sb.append("• State: ").append(demo.getState()).append("\n");
        }
        if (demo.getZip() != null && !demo.getZip().isEmpty()) {
            sb.append("• ZIP Code: ").append(demo.getZip()).append("\n");
        }
        if (demo.getIncomeBracket() != null && !demo.getIncomeBracket().isEmpty()) {
            sb.append("• Income Bracket: ").append(demo.getIncomeBracket()).append("\n");
        }
        if (Boolean.TRUE.equals(demo.getVeteran())) {
            sb.append("• Military Status: Veteran\n");
        }
        if (Boolean.TRUE.equals(demo.getStudent())) {
            sb.append("• Education Status: Student\n");
        }
        if (Boolean.TRUE.equals(demo.getSmallBusinessOwner())) {
            sb.append("• Business Status: Small Business Owner\n");
        }
        
        if (sb.length() == 0) {
            sb.append("• Limited demographic information provided\n");
        }
        
        return sb.toString();
    }

    private String identifyRelevantCategories(Demographics demo) {
        StringBuilder sb = new StringBuilder();
        
        if (demo.getAge() != null) {
            if (demo.getAge() < 18) {
                sb.append("• Youth-related policies\n");
            } else if (demo.getAge() < 30) {
                sb.append("• Early career and student loan policies\n");
            } else if (demo.getAge() < 65) {
                sb.append("• Working-age workforce policies\n");
            } else {
                sb.append("• Senior and retirement policies\n");
            }
        }
        
        if (Boolean.TRUE.equals(demo.getStudent())) {
            sb.append("• Education funding and loan programs\n");
            sb.append("• Tuition assistance policies\n");
        }
        
        if (demo.getIncomeBracket() != null) {
            sb.append("• ").append(demo.getIncomeBracket()).append(" income bracket policies\n");
            sb.append("• Tax implications\n");
        }
        
        if (Boolean.TRUE.equals(demo.getVeteran())) {
            sb.append("• Veterans benefits and protections\n");
            sb.append("• Military-related provisions\n");
        }
        
        if (Boolean.TRUE.equals(demo.getSmallBusinessOwner())) {
            sb.append("• Small business tax and regulatory impacts\n");
            sb.append("• Business funding and loan programs\n");
        }
        
        if (demo.getState() != null && !demo.getState().isEmpty()) {
            sb.append("• State-specific implementation (").append(demo.getState()).append(")\n");
        }
        
        if (sb.length() == 0) {
            sb.append("• General economic and policy impacts\n");
        }
        
        return sb.toString();
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
