package com.policyme.Policyme.model.UserModel;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Demographic {
    @MongoId
    private String id;

    private String userId;
    private int age;

    private String gender;

    private String state;


}
