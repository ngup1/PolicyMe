package com.policyme.Policyme.repository;


import com.policyme.Policyme.model.SummariesModel.Summary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SummaryRepository extends MongoRepository<Summary, String> {
}
