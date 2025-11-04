package com.policyme.Policyme.model.BillModel;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sponsor {
    private String bioguideId;
    private String firstName;
    private String middleName;
    private String lastName;
    private String fullName;
    private String party;
    private String state;
    private String url;
}
