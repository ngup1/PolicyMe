package com.policyme.Policyme.model.AmendmentModel;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AmendedBill {
    private int congress;
    private String number;
    private String originChamber;
    private String originChamberCode;
    private String title;
    private String type;
    private String url;

}