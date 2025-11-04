package com.policyme.Policyme.model.SummariesModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillReference{
    private int congress;
    private String number;
    private String originChamber;
    private String originChamberCode;
    private String title;
    private String type;
    private String updateDateIncludingText;
    private String url;
}