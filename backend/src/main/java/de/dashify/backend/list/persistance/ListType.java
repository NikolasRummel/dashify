package de.dashify.backend.list.persistance;

import lombok.Getter;

@Getter
public enum ListType {
    TODO("TODO"),
    SHOPPING("SHOPPING");

    private final String label;

    ListType(String label) {
        this.label = label;
    }

}
