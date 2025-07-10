package de.dashify.backend.auth;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import de.dashify.backend.auth.controller.AuthController;
import de.dashify.backend.auth.dto.AuthenticationRequest;
import de.dashify.backend.auth.dto.LoginResponse;
import de.dashify.backend.auth.dto.RegisterResponse;
import de.dashify.backend.auth.service.AuthService;
import de.dashify.backend.auth.security.jwt.CookieService;
import de.dashify.backend.user.persistance.User;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

import java.util.Objects;

@SpringBootTest
class AuthenticationControllerUnitTest {

    private final AuthService authService = mock(AuthService.class);
    private final CookieService cookieService = mock(CookieService.class);
    private final AuthController authController = new AuthController(authService);

    @Test
    public void shouldRegisterSuccessfully() {
        AuthenticationRequest request = new AuthenticationRequest();
        request.setUsername("testuser");
        request.setEmail("test@test.de");
        request.setPassword("password");

        RegisterResponse response = new RegisterResponse();
        response.setSuccess(true);
        response.setMessage("User registered successfully");


        when(authService.register(request)).thenReturn(ResponseEntity.status(HttpStatus.CREATED).body(response));

        ResponseEntity<RegisterResponse> httpResponse = authController.registerUser(request);

        verify(authService).register(request);

        assertNotNull(httpResponse.getBody());
        assertEquals(201, httpResponse.getStatusCode().value());
        assertTrue(Objects.requireNonNull(httpResponse.getBody()).isSuccess());
        assertEquals("User registered successfully", httpResponse.getBody().getMessage());
    }

    @Test
    public void registerError_whenUsernameOrEmailAlreadyExists() {
        AuthenticationRequest request = new AuthenticationRequest();
        request.setUsername("testuser");
        request.setEmail("test@test.de");
        request.setPassword("password");

        when(authService.register(request)).thenReturn(
                ResponseEntity.badRequest().body(new RegisterResponse(false, "Username is already in use!"))
        );

        ResponseEntity<RegisterResponse> httpResponse = authController.registerUser(request);

        verify(authService).register(request);

        assertNotNull(httpResponse.getBody());
        assertEquals(400, httpResponse.getStatusCode().value());
        assertFalse(
                Objects.requireNonNull(httpResponse.getBody()).isSuccess());
        assertEquals("Username is already in use!", httpResponse.getBody().getMessage());
    }

    @Test
    public void loginSuccess_whenCredentialsAreCorrect() {
        AuthenticationRequest request = new AuthenticationRequest();
        request.setUsername("testuser");
        request.setPassword("password");

        String mockJwtToken = "mockJwtToken";

        LoginResponse loginResponse = new LoginResponse(true, "Successfully logged in!", new User());

        when(authService.login(request)).thenReturn(ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, "jwt=" + mockJwtToken)
                .body(loginResponse));

        ResponseEntity<LoginResponse> httpResponse = authController.loginUser(request);

        verify(authService).login(request);

        assertEquals(200, httpResponse.getStatusCode().value());
        assertEquals("Successfully logged in!", Objects.requireNonNull(httpResponse.getBody()).getMessage());
    }

    @Test
    public void loginInvalidCredentials_whenUsernameOrPasswordIsIncorrect() {
        AuthenticationRequest request = new AuthenticationRequest();
        request.setUsername("testuser");
        request.setPassword("wrongpassword");

        LoginResponse loginResponse = new LoginResponse(false, "Invalid username or password.", null);

        when(authService.login(request)).thenReturn(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(loginResponse));

        ResponseEntity<LoginResponse> httpResponse = authController.loginUser(request);

        verify(authService).login(request);

        assertEquals(401, httpResponse.getStatusCode().value());
        assertEquals("Invalid username or password.", Objects.requireNonNull(httpResponse.getBody()).getMessage());
    }

    @Test
    public void logoutSuccess() {
        ResponseCookie mockJwtCookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        when(cookieService.getCleanJwtCookie("/")).thenReturn(mockJwtCookie);
        when(authService.logout()).thenReturn(ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, mockJwtCookie.toString())
                .body("You've been signed out!"));

        ResponseEntity<?> httpResponse = authController.logoutUser();
        System.out.println(httpResponse);

        verify(authService).logout();

        assertEquals(200, httpResponse.getStatusCode().value());
        assertEquals("You've been signed out!", httpResponse.getBody());

        assertTrue(httpResponse.getHeaders().containsKey(HttpHeaders.SET_COOKIE));
        assertTrue(Objects.requireNonNull(httpResponse.getHeaders().get(HttpHeaders.SET_COOKIE)).get(0).contains("jwt="));
    }

}
