package com.policyme.Policyme.repository;


import com.policyme.Policyme.model.AmendmentModel.Amendment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AmendmentRepository extends MongoRepository<Amendment, String> {

}
