package de.dashify.backend.auth.controller;

import de.dashify.backend.auth.dto.LoginResponse;
import de.dashify.backend.auth.dto.RegisterResponse;
import de.dashify.backend.auth.dto.AuthenticationRequest;
import de.dashify.backend.auth.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@Validated @RequestBody AuthenticationRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerUser(@Validated @RequestBody AuthenticationRequest signUpRequest) {
        return authService.register(signUpRequest);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        return authService.logout();
    }

}