package com.studybuddy.backend.service;

import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.studybuddy.backend.model.User;
import com.studybuddy.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository; // ✨ Inject repository directly

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String fullName = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        String firstName = "";
        String lastName = "";

        if (fullName != null && fullName.contains(" ")) {
            String[] nameParts = fullName.split(" ");
            firstName = nameParts[0];
            lastName = nameParts[1];
        } else {
            firstName = fullName;
            lastName = ""; // ✨ set lastName to empty string if not available
        }

        final String fName = firstName; // ✨ make them final
        final String lName = lastName;

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> User.builder()
                        .email(email)
                        .firstName(fName)
                        .lastName(lName)
                        .profilePictureUrl(picture)
                        .enabled(true)
                        .role("user")
                        .build());

        user.setFirstName(fName);
        user.setLastName(lName);
        user.setProfilePictureUrl(picture);
        user.setEnabled(true);

        userRepository.save(user);

        return oAuth2User;
    }
}