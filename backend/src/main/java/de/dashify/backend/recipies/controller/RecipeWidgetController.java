package de.dashify.backend.recipies.controller;

import de.dashify.backend.recipies.RecipeService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/widgets/recipe/random")
@AllArgsConstructor
public class RecipeWidgetController {

    private final RecipeService recipeService;

    @Operation(summary = "Get a random recipe")
    @GetMapping()
    public ResponseEntity<?> getRandomRecipe() {
        return recipeService.getRandomRecipe();
    }
}
