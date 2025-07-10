package de.dashify.backend.user.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import de.dashify.backend.auth.security.jwt.CookieService;
import de.dashify.backend.user.dto.UserUpdateRequest;
import de.dashify.backend.user.persistance.User;
import de.dashify.backend.user.persistance.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService {

    private UserRepository userRepository;
    private CookieService cookieService;

    public ResponseEntity<?> getAuthenticatedUser(UserDetails userDetails) {
        String username = userDetails.getUsername();
        return userRepository.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @Transactional
    public ResponseEntity<?> updateUser(UserDetails userDetails, UserUpdateRequest userUpdateRequest) {
        String username = userDetails.getUsername();

        return userRepository.findByUsername(username)
                .map(user -> {

                    if (userUpdateRequest.getBackgroundImage() != null) {
                        user.setBackgroundImage(userUpdateRequest.getBackgroundImage());
                    }
                    if(userUpdateRequest.getProfilePicture() != null) {
                        user.setProfilePicture(userUpdateRequest.getProfilePicture());
                    }
                    if(userUpdateRequest.getLanguage() != null) {
                        user.setLanguage(userUpdateRequest.getLanguage());
                    }
                    if(userUpdateRequest.getBackgroundImage() != null) {
                        user.setBackgroundImage(userUpdateRequest.getBackgroundImage());
                    }
                    if(userUpdateRequest.getAccentColor() != null) {
                        user.setAccentColor(userUpdateRequest.getAccentColor());
                    }

                    userRepository.save(user);

                    User returnedUser = User.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .language(user.getLanguage())
                            .backgroundImage(user.getBackgroundImage())
                            .accentColor(user.getAccentColor())
                            .profilePicture("api/users/image/" + user.getId() + "/" + UUID.randomUUID())
                            .build();

                    try {
                        ResponseCookie userCookie = cookieService.generateUserCookie(returnedUser);
                        return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, userCookie.toString())
                                .body(returnedUser);
                    } catch (JsonProcessingException e) {
                        throw new RuntimeException(e);
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Transactional
    public ResponseEntity<?> deleteUser(UserDetails userDetails) {
        String username = userDetails.getUsername();
        Optional<User> optionalUser = userRepository.findByUsername(username);


        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            userRepository.deleteById(user.getId());

            System.out.println("Deleted user " + user.getId());

            ResponseCookie cookie = cookieService.getCleanJwtCookie("/");
            ResponseCookie userCookie = cookieService.getCleanUserCookie("/");
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
            headers.add(HttpHeaders.SET_COOKIE, userCookie.toString());

            return ResponseEntity.ok().headers(headers).body("User deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<?> getUserImage(Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    String dataUrl = user.getProfilePicture();

                    // Basic validation
                    if (dataUrl == null || !dataUrl.startsWith("data:")) {
                        return ResponseEntity.badRequest().body("Invalid or missing data URL");
                    }

                    try {
                        // Extract MIME type and base64 data
                        String[] parts = dataUrl.split(",");
                        String metaPart = parts[0]; // e.g., data:image/png;base64
                        String base64Data = parts[1];

                        String mimeType = metaPart.substring(5, metaPart.indexOf(';'));

                        byte[] imageBytes = Base64.getDecoder().decode(base64Data);

                        return ResponseEntity.ok()
                                .contentType(MediaType.parseMediaType(mimeType))
                                .body(imageBytes);
                    } catch (Exception e) {
                        return ResponseEntity.status(500).body("Error processing image: " + e.getMessage());
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<?> getBackgroundImage(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            return ResponseEntity.ok(user.getBackgroundImage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    public ResponseEntity<?> getAccentColor(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            return ResponseEntity.ok(user.getAccentColor());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void resetCounter(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.resetCount();
            userRepository.save(user);
        }
    }

    public ResponseEntity<?> increaseCounter(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            if (user.getAiTryCount() <= 5) {
                user.setAiTryCount(user.getAiTryCount() + 1);
                userRepository.save(user);
                return ResponseEntity.ok().body("Counter updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Limit of 5 tries reached!");
            }

        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Unknown user");
    }
}
