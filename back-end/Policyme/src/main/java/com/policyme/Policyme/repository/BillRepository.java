package com.policyme.Policyme.repository;


import com.policyme.Policyme.model.BillModel.Bill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillRepository extends MongoRepository<Bill, String> {

}
