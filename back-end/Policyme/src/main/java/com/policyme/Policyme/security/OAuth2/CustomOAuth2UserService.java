package com.policyme.Policyme.security.OAuth2;

import com.policyme.Policyme.model.UserModel.AuthProvider;
import com.policyme.Policyme.model.UserModel.User;
import com.policyme.Policyme.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerId = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");

        final String firstName = oAuth2User.getAttribute("given_name");
        final String lastName = oAuth2User.getAttribute("family_name");

        // Find or create user
        User user = userRepository.findByProviderId(providerId)
                .orElseGet(() -> userRepository.save(User.builder()
                        .email(email)
                        .firstName(firstName)
                        .lastName(lastName)
                        .authProvider(AuthProvider.valueOf(provider.toUpperCase()))
                        .providerId(providerId)
                        .build()
                ));

        return oAuth2User;
    }
}
