package de.dashify.backend.recipies.controller;

import de.dashify.backend.auth.security.services.UserDetailsImpl;
import de.dashify.backend.recipies.RecipeService;
import de.dashify.backend.recipies.persistance.Recipe;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
@Tag(name = "Recipes", description = "Manage personal and public recipes")
public class RecipeController {

    private final RecipeService recipeService;

    @Operation(summary = "Create a new recipe")
    @PostMapping
    public ResponseEntity<?> createRecipe(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                          @RequestBody Recipe recipeRequest) {
        return recipeService.createRecipe(userDetails, recipeRequest);
    }

    @Operation(summary = "Get a recipe by ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipe(@PathVariable Long id,
                                       @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return recipeService.getRecipe(id, userDetails);
    }

    @Operation(summary = "Update a recipe by ID")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecipe(@PathVariable Long id,
                                          @AuthenticationPrincipal UserDetailsImpl userDetails,
                                          @RequestBody Recipe recipeUpdate) {
        return recipeService.updateRecipe(id, userDetails, recipeUpdate);
    }

    @Operation(summary = "Delete a recipe by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable Long id,
                                          @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return recipeService.deleteRecipe(id, userDetails);
    }

    @Operation(summary = "Duplicate a recipe by ID")
    @PostMapping("/{id}/duplicate")
    public ResponseEntity<?> duplicateRecipe(@PathVariable Long id,
                                             @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return recipeService.duplicateRecipe(id, userDetails);
    }

    @Operation(summary = "Get all public recipes")
    @GetMapping("/public")
    public ResponseEntity<?> getAllPublicRecipes() {
        return recipeService.getAllPublicRecipes();
    }

    @Operation(summary = "Get all recipes of the authenticated user")
    @GetMapping("/my")
    public ResponseEntity<?> getMyRecipes(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return recipeService.getRecipes(userDetails);
    }
}
