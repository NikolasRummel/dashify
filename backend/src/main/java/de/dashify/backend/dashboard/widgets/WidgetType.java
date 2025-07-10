package de.dashify.backend.dashboard.widgets;

import lombok.Getter;

@Getter
public enum WidgetType {

    WEATHER("WEATHER"),
    CLOCK("CLOCK"),
    LIST("LIST"),
    MEAL_PLAN("MEAL_PLAN"),
    MENU("MENU"),
    RECIPE("RECIPE"),
    BATTERY("BATTERY"),
    MAP("MAP"),
    CAT("CAT"),
    DOG("DOG"),
    DEBUG("DEBUG");

    private String label;

    WidgetType(String label) {
        this.label = label;
    }
}
