package com.policyme.Policyme.repository;


import com.policyme.Policyme.model.BillModel.Bill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BillRepository extends MongoRepository<Bill, String> {

	// Returns up to 20 bills whose title contains the given query (case-insensitive)
	List<Bill> findTop20ByTitleContainingIgnoreCase(String titlePart);

	// Returns up to 20 bills matching the policy area name (case-insensitive)
	List<Bill> findTop20ByPolicyArea_NameIgnoreCase(String policyAreaName);

	// Returns the 20 most recently updated bills
	List<Bill> findTop20ByOrderByUpdateDateDesc();
}
