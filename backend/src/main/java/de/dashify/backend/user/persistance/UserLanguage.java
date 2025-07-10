package de.dashify.backend.user.persistance;

import lombok.Getter;

@Getter
public enum UserLanguage {
    GERMAN("DE"),
    ENGLISH("EN");

    private final String label;

    UserLanguage(String label) {
        this.label = label;
    }

}
