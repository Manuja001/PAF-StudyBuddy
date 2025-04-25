package com.studybuddy.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studybuddy.backend.io.AuthRequest;
import com.studybuddy.backend.io.AuthResponse;
import com.studybuddy.backend.service.AppUserDetailsService;
import com.studybuddy.backend.utils.jwtUtils;

import lombok.AllArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService userDetailsService;
    private final jwtUtils jwtUtils = new jwtUtils();

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest authRequest) {
        // Authenticate the user using the authentication manager
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
        final UserDetails userdetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
        final String jwtToken = jwtUtils.generateToken(userdetails);

        return new AuthResponse(authRequest.getEmail(), jwtToken);
    }

}
