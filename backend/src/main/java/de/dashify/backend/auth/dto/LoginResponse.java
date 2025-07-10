package de.dashify.backend.auth.dto;

import de.dashify.backend.user.persistance.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private boolean success;
    private String message;
    private User user;
}
