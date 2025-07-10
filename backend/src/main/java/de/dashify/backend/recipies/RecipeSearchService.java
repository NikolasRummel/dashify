package de.dashify.backend.recipies;

import de.dashify.backend.auth.security.services.UserDetailsImpl;
import de.dashify.backend.recipies.persistance.Recipe;
import de.dashify.backend.recipies.persistance.RecipeRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RecipeSearchService {

    private RecipeRepository recipeRepository;

    @Transactional
    public void enableFuzzySearch() {
        recipeRepository.enableFuzzySearch();
    }

    @Transactional
    public ResponseEntity<?> searchByTitleFuzzy(String query, UserDetailsImpl userDetails, boolean privateOnly) {
        try {
            List<Recipe> recipes = recipeRepository.searchByTitleFuzzy(query, userDetails.getId(), privateOnly);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error occurred while searching recipes: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while searching recipes.");
        }
    }

    public ResponseEntity<?> searchRecipeTitlesSuggestions(String query, UserDetailsImpl userDetails, boolean privateOnly) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Query parameter is required.");
        }

        List<Object[]> results = recipeRepository.searchTitleSuggestions(query, userDetails.getId(), privateOnly);

        if (results != null && !results.isEmpty()) {
            List<Map<String, Object>> suggestions = results.stream()
                    .map(result -> {
                        Map<String, Object> suggestion = new HashMap<>();
                        suggestion.put("id", result[0]);
                        suggestion.put("title", result[1]);
                        return suggestion;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(suggestions);
        }

        return ResponseEntity.ok(Collections.emptyList());
    }


}
