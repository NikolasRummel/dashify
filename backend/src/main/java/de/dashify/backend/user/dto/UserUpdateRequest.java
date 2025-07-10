package de.dashify.backend.user.dto;

import de.dashify.backend.user.persistance.UserLanguage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateRequest {
    private String accentColor;
    private String backgroundImage;
    private String profilePicture;
    private UserLanguage language;
}
