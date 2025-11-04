package com.policyme.Policyme.model.BillModel;


import com.policyme.Policyme.model.BillModel.LatestAction;
import com.policyme.Policyme.model.BillModel.Law;
import com.policyme.Policyme.model.BillModel.PolicyArea;
import com.policyme.Policyme.model.BillModel.Sponsor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;
import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bills")
public class Bill {
    @MongoId
    private String id;

    private int congress;
    private LatestAction latestAction;
    private String number;
    private String originChamber;
    private String originChamberCode;
    private String title;
    private String type;
    private String updateDate;
    private String updateDateIncludingText;
    private String url;


    // Extra fields (for /bill/{congress}/{billType}/{billNumber})
    private String introducedDate;
    private List<Law> laws;
    private PolicyArea policyArea;
    private List<Sponsor> sponsors;



}
