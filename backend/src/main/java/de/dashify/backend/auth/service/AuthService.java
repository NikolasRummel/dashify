package de.dashify.backend.auth.service;

import de.dashify.backend.auth.dto.LoginResponse;
import de.dashify.backend.auth.dto.RegisterResponse;
import de.dashify.backend.dashboard.DashboardService;
import de.dashify.backend.user.persistance.User;
import de.dashify.backend.user.persistance.UserLanguage;
import de.dashify.backend.user.persistance.UserRepository;
import de.dashify.backend.auth.dto.AuthenticationRequest;
import de.dashify.backend.auth.security.jwt.CookieService;
import de.dashify.backend.auth.security.services.UserDetailsImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@AllArgsConstructor
public class AuthService {

    private UserRepository userRepository;
    private AuthenticationManager authenticationManager;
    private PasswordEncoder encoder;
    private CookieService cookieService;
    private DashboardService dashboardService;

    public ResponseEntity<LoginResponse> login(AuthenticationRequest loginRequest) {
        String mailOrUsername = loginRequest.getUsername() == null ? loginRequest.getEmail() : loginRequest.getUsername();
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(mailOrUsername, loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            ResponseCookie jwtCookie = cookieService.generateJwtCookie(userDetails);

            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            user.setPassword(null);
            user.setProfilePicture("api/users/image/" + user.getId() + "/" + UUID.randomUUID());

            ResponseCookie userCookie = cookieService.generateUserCookie(user);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.SET_COOKIE, jwtCookie.toString());
            headers.add(HttpHeaders.SET_COOKIE, userCookie.toString());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(new LoginResponse(true, "Successfully logged in!", user));

        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new LoginResponse(false, "Invalid username or password!", null)
            );
        }
    }

    public ResponseEntity<RegisterResponse> register(AuthenticationRequest signUpRequest) {
        String normalizedUsername = signUpRequest.getUsername().toLowerCase();
        String normalizedEmail = signUpRequest.getEmail().toLowerCase();

        if (userRepository.existsByUsername(normalizedUsername)) {
            return ResponseEntity.badRequest().body(
                    new RegisterResponse(false, "Username is already in use!")
            );
        }

        if (userRepository.existsByEmail(normalizedEmail)) {
            return ResponseEntity.badRequest().body(
                    new RegisterResponse(false, "Username is already in use!")
            );
        }

        System.out.println(signUpRequest);
        User user = new User(
                normalizedEmail,
                normalizedUsername,
                encoder.encode(signUpRequest.getPassword()),
                UserLanguage.ENGLISH
        );

        userRepository.save(user);

        dashboardService.createSampleDashboard(user.getId());

        userRepository.flush();
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new RegisterResponse(true, "User registered successfully!")
        );
    }

    public ResponseEntity<String> logout() {
        ResponseCookie cookie = cookieService.getCleanJwtCookie("/");
        ResponseCookie userCookie = cookieService.getCleanUserCookie("/");
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
        headers.add(HttpHeaders.SET_COOKIE, userCookie.toString());

        return ResponseEntity.ok()
                .headers(headers)
                .body("You've been signed out!");
    }
}
