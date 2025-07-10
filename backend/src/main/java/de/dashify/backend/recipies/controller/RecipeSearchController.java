package de.dashify.backend.recipies.controller;

import de.dashify.backend.auth.security.services.UserDetailsImpl;
import de.dashify.backend.recipies.RecipeSearchService;
import de.dashify.backend.recipies.persistance.Recipe;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recipes")
@AllArgsConstructor
public class RecipeSearchController {

    private final RecipeSearchService searchService;

    @GetMapping("/search")
    public ResponseEntity<?> searchRecipes(
            @RequestParam(required = false) String query,
            @RequestParam(required = false, defaultValue = "false") boolean privateOnly,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return searchService.searchByTitleFuzzy(query, userDetails, privateOnly);
    }

    @GetMapping("/search/suggestions")
    public ResponseEntity<?> getRecipeTitleSuggestions(
            @RequestParam("query") String query,
            @RequestParam(required = false, defaultValue = "false") boolean privateOnly,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return searchService.searchRecipeTitlesSuggestions(query, userDetails, privateOnly);
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateRecipeWithAi(@RequestBody Object aiRequest) {
        return ResponseEntity.ok().body(new Recipe());
    }
}
