package com.policyme.Policyme.dto;

import com.policyme.Policyme.model.UserModel.User;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    @NotBlank
    private String userId;

    @NotBlank
    private String email;

    private String firstName;
    private String lastName;
    @NotBlank
    private Instant createdDate;


    private String profilePicture;

    public UserDTO(User user) {
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.createdDate = user.getCreatedDate();
        this.profilePicture = user.getProfilePicture();
    }
}
