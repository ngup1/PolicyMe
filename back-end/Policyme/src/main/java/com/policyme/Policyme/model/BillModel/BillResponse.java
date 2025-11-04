package com.policyme.Policyme.model.BillModel;

import com.policyme.Policyme.model.BillModel.Bill;
import lombok.Data;
import java.util.List;


@Data
public class BillResponse{
    private List<Bill> bills;

}