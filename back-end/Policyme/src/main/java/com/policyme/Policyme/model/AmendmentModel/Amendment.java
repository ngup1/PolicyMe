package com.policyme.Policyme.model.AmendmentModel;


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
@Document(collection = "amendments")
public class Amendment {
    @MongoId
    private String id;

    private int congress;
    private LatestAction latestAction;
    private String number;
    private String purpose;
    private String type;
    private String updateDate;
    private String url;

    // extra for detailed endpoint
    private String chamber;
    private String proposedDate;
    private String submittedDate;
    private int cosponsorCount;
    private List<Sponsor> sponsors;
    private AmendedBill amendedBill;



}
