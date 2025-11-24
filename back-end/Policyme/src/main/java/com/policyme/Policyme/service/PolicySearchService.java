package com.policyme.Policyme.service;

import com.policyme.Policyme.model.BillModel.Bill;
import com.policyme.Policyme.repository.BillRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PolicySearchService {
    private final BillRepository billRepository;

    public PolicySearchService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    public List<Bill> search(String query, String policyArea) {
        List<Bill> results = new ArrayList<>();
        if (query != null && !query.isBlank()) {
            results.addAll(billRepository.findTop20ByTitleContainingIgnoreCase(query));
        }
        if (policyArea != null && !policyArea.isBlank()) {
            results.addAll(billRepository.findTop20ByPolicyArea_NameIgnoreCase(policyArea));
        }
        // naive de-duplication by id
        return results.stream().collect(java.util.stream.Collectors.toMap(Bill::getId, b -> b, (a,b)->a))
                .values().stream().toList();
    }

    public List<Bill> getRecentBills() {
        return billRepository.findTop20ByOrderByUpdateDateDesc();
    }
}
