package de.dashify.backend.recipies;

import de.dashify.backend.recipies.persistance.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class RecipeSeeder implements CommandLineRunner {

    private final RecipeService recipeService;
    private final RecipeRepository recipeRepository;
    private final RecipeSearchService recipeSearchService;

    @Override
    @Transactional
    public void run(String... args) {
        Long testUserId = 1L;

        if(recipeRepository.findRandomPublicRecipe() == null) {
            recipeSearchService.enableFuzzySearch();
            recipeService.createSampleRecipes(testUserId);
            System.out.println("✅ Sample recipes seeded on startup and enabled fuzzy search!");
        } else {
            System.out.println("Sample recipes already exist. Skipping seeding and enabling fuzzy search.");
        }
    }
}
