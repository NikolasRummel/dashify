package de.dashify.backend.user.controller;

import de.dashify.backend.user.dto.UserUpdateRequest;
import de.dashify.backend.user.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getAuthenticatedUser(@AuthenticationPrincipal UserDetails userDetails) {
        return userService.getAuthenticatedUser(userDetails);
    }

    @GetMapping("/image/{id}/{random}")
    public ResponseEntity<?> getUserImage(@PathVariable Long id, @PathVariable String random) {
        return userService.getUserImage(id);
    }

    @GetMapping("/color/{id}")
    public ResponseEntity<?> getUserColor(@PathVariable Long id) {
        return userService.getAccentColor(id);
    }

    @GetMapping("/backgroundImage/{id}")
    public ResponseEntity<?> getBackgroundImage(@PathVariable Long id) {
        return userService.getBackgroundImage(id);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateUser(@AuthenticationPrincipal UserDetails userDetails, @RequestBody UserUpdateRequest userUpdateRequest) {
        return userService.updateUser(userDetails, userUpdateRequest);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(@AuthenticationPrincipal UserDetails userDetails){
        return userService.deleteUser(userDetails);
    }


}
