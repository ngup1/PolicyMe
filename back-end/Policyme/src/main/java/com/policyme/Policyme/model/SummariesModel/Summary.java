package com.policyme.Policyme.model.SummariesModel;


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
@Document(collection = "summaries")
public class Summary {
    @MongoId
    private String id;

    private String actionDate;
    private String actionDesc;
    private BillReference bill;
    private String currentChamber;
    private String currentChamberCode;
    private String lastSummaryUpdateDate;
    private String text;
    private String updateDate;
    private String versionCode;


}
