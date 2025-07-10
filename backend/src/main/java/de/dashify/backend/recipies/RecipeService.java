package de.dashify.backend.recipies;

import de.dashify.backend.auth.security.services.UserDetailsImpl;
import de.dashify.backend.recipies.persistance.Ingredient;
import de.dashify.backend.recipies.persistance.Recipe;
import de.dashify.backend.recipies.persistance.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;

    @Transactional
    public ResponseEntity<?> createRecipe(UserDetailsImpl userDetails, Recipe recipeRequest) {
        recipeRequest.setUserId(userDetails.getId());
        recipeRequest.getIngredients().forEach(i -> i.setRecipe(recipeRequest));

        return ResponseEntity.ok(recipeRepository.save(recipeRequest));
    }

    @Transactional
    public ResponseEntity<?> getRecipe(Long id, UserDetailsImpl userDetails) {
        Recipe recipe = recipeRepository.findById(id).orElse(null);

        if (recipe == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not find recipe with id " + id);

        if (!recipe.getIsPublic() && !recipe.getUserId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized to view this recipe");
        }

        return ResponseEntity.ok(recipe);
    }

    @Transactional
    public ResponseEntity<?> updateRecipe(Long id, UserDetailsImpl userDetails, Recipe recipeUpdate) {
        Recipe existing = recipeRepository.findById(id).orElse(null);

        if (existing == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not find recipe with id " + id);

        if (!existing.getUserId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized to update this recipe");
        }

        if (recipeUpdate.getName() != null) existing.setName(recipeUpdate.getName());
        if (recipeUpdate.getImage() != null) existing.setImage(recipeUpdate.getImage());
        if (recipeUpdate.getDescription() != null) existing.setDescription(recipeUpdate.getDescription());
        if (recipeUpdate.getInstructions() != null) existing.setInstructions(recipeUpdate.getInstructions());
        if (recipeUpdate.getPortions() != null) existing.setPortions(recipeUpdate.getPortions());
        if (recipeUpdate.getPreparation() != null) existing.setPreparation(recipeUpdate.getPreparation());
        if (recipeUpdate.getCookingTime() != null) existing.setCookingTime(recipeUpdate.getCookingTime());
        if (recipeUpdate.getCalories() != null) existing.setCalories(recipeUpdate.getCalories());
        if (recipeUpdate.getFat() != null) existing.setFat(recipeUpdate.getFat());
        if (recipeUpdate.getCarbohydrates() != null) existing.setCarbohydrates(recipeUpdate.getCarbohydrates());
        if (recipeUpdate.getProtein() != null) existing.setProtein(recipeUpdate.getProtein());
        if (recipeUpdate.getIsPublic() != null) existing.setIsPublic(recipeUpdate.getIsPublic());

        if (recipeUpdate.getIngredients() != null) {
            existing.getIngredients().clear();
            for (Ingredient ingredient : recipeUpdate.getIngredients()) {
                ingredient.setRecipe(existing);
                existing.getIngredients().add(ingredient);
            }
        }

        return ResponseEntity.ok(recipeRepository.save(existing));
    }

    @Transactional
    public ResponseEntity<?> deleteRecipe(Long id, UserDetailsImpl userDetails) {
        Recipe recipe = recipeRepository.findById(id).orElse(null);

        if (recipe == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not find recipe with id " + id);

        if (!recipe.getUserId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized to view this recipe");
        }

        recipeRepository.delete(recipe);
        return ResponseEntity.ok().body("Successfully deleted recipe!");
    }

    @Transactional
    public ResponseEntity<?> duplicateRecipe(Long id, UserDetailsImpl userDetails) {
        Recipe original = recipeRepository.findById(id).orElse(null);

        if (original == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not find recipe with id " + id);

        if (!original.getIsPublic() && !original.getUserId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized to update this recipe");
        }

        Recipe duplicate = Recipe.builder()
                .userId(userDetails.getId())
                .name(original.getName() + " (Copy)")
                .image(original.getImage())
                .description(original.getDescription())
                .instructions(original.getInstructions())
                .portions(original.getPortions())
                .preparation(original.getPreparation())
                .cookingTime(original.getCookingTime())
                .calories(original.getCalories())
                .fat(original.getFat())
                .carbohydrates(original.getCarbohydrates())
                .protein(original.getProtein())
                .isPublic(false)
                .build();

        List<Ingredient> copiedIngredients = original.getIngredients().stream()
                .map(i -> new Ingredient(null, duplicate, i.getName(), i.getAmount(), i.getUnit()))
                .toList();

        duplicate.setIngredients(copiedIngredients);

        return ResponseEntity.ok(recipeRepository.save(duplicate));
    }

    @Transactional
    public ResponseEntity<?> getAllPublicRecipes() {
        return ResponseEntity.ok(recipeRepository.findAll().stream().filter(recipe -> recipe.getIsPublic().equals(true)).toList());
    }

    @Transactional
    public ResponseEntity<?> getRecipes(UserDetailsImpl userDetails) {
        return ResponseEntity.ok(recipeRepository.findAllByUserId(userDetails.getId()));
    }

    @Transactional
    public ResponseEntity<?> getRandomRecipe() {
        Recipe recipe = recipeRepository.findRandomPublicRecipe();
        if (recipe == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No public recipes found");
        }
        return ResponseEntity.ok(recipe);
    }


    @Transactional
    public void createSampleRecipes(Long userId) {
        List<Recipe> recipes = List.of(
                Recipe.builder()
                        .userId(userId)
                        .name("Spaghetti Carbonara")
                        .description("Classic Italian pasta dish with egg, cheese, pancetta, and pepper.")
                        .image("https://www.allrecipes.com/thmb/Vg2cRidr2zcYhWGvPD8M18xM_WY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/11973-spaghetti-carbonara-ii-DDMFS-4x3-6edea51e421e4457ac0c3269f3be5157.jpg")
                        .portions(2)
                        .preparation("Boil pasta. Mix egg, cheese, and pepper. Add pancetta. Combine.")
                        .cookingTime(20)
                        .calories(550)
                        .fat(25)
                        .carbohydrates(50)
                        .protein(20)
                        .isPublic(true)
                        .build(),

                Recipe.builder()
                        .userId(userId)
                        .name("Avocado Toast")
                        .description("Simple and tasty breakfast with smashed avocado and toast.")
                        .image("https://whatsgabycooking.com/wp-content/uploads/2023/01/Master.jpg")
                        .portions(1)
                        .preparation("Toast bread. Smash avocado. Add seasoning.")
                        .cookingTime(10)
                        .calories(300)
                        .fat(15)
                        .carbohydrates(25)
                        .protein(6)
                        .isPublic(true)
                        .build(),

                Recipe.builder()
                        .userId(userId)
                        .name("Chicken Stir Fry")
                        .description("Quick stir fry with chicken and colorful veggies.")
                        .image("https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2021/05/Chicken-Stir-Fry-main.jpg")
                        .portions(2)
                        .preparation("Sauté chicken. Add vegetables. Stir-fry with sauce.")
                        .cookingTime(25)
                        .calories(450)
                        .fat(12)
                        .carbohydrates(30)
                        .protein(35)
                        .isPublic(true)
                        .build(),

                Recipe.builder()
                        .userId(userId)
                        .name("Protein Smoothie")
                        .description("Healthy smoothie packed with protein and nutrients.")
                        .image("https://cdn.shopify.com/s/files/1/1440/0358/files/Himbeere-Joghurt_High_Protein_Smoothie2_1_1_600x600.jpg?v=1661206072")
                        .portions(1)
                        .preparation("Blend all ingredients until smooth.")
                        .cookingTime(5)
                        .calories(250)
                        .fat(5)
                        .carbohydrates(20)
                        .protein(25)
                        .isPublic(false)
                        .build(),

                Recipe.builder()
                        .userId(userId)
                        .name("Beef Tacos")
                        .description("Mexican-style tacos with seasoned beef and toppings.")
                        .image("https://www.twopeasandtheirpod.com/wp-content/uploads/2022/12/Beef-Tacos-55.jpg")
                        .portions(3)
                        .preparation("Cook beef. Assemble with toppings in tortillas.")
                        .cookingTime(30)
                        .calories(600)
                        .fat(30)
                        .carbohydrates(40)
                        .protein(35)
                        .isPublic(true)
                        .build(),

                Recipe.builder()
                        .userId(userId)
                        .name("Chicken Tikka Masala")
                        .description("A popular Indian dish with marinated chicken in a spiced tomato sauce.")
                        .image("https://www.recipetineats.com/tachyon/2018/04/Chicken-Tikka-Masala_0-SQ.jpg")
                        .portions(4)
                        .preparation("Marinate chicken. Cook in sauce. Serve with rice.")
                        .cookingTime(40)
                        .calories(350)
                        .fat(15)
                        .carbohydrates(50)
                        .protein(10)
                        .isPublic(true)
                        .build(),

                Recipe.builder()
                        .userId(userId)
                        .name("Steak with Potatoes and Mushrooms")
                        .description("Juicy steak served with roasted potatoes and sautéed mushrooms.")
                        .image("https://images.lecker.de/champignon-steak-pfanne/1x1,id=66a602bb,b=lecker,w=1600,h=,ca=12.42,0,87.58,100,rm=sk.jpeg")
                        .portions(2)
                        .preparation("Cook steak. Roast potatoes. Sauté mushrooms.")
                        .cookingTime(35)
                        .calories(700)
                        .fat(40)
                        .carbohydrates(30)
                        .protein(50)
                        .isPublic(true)
                        .build(),

                Recipe.builder()
                        .userId(userId)
                        .name("Gourmet-Bacon-Cheeseburger")
                        .description("Juicy beef patty with melted cheese, crispy bacon, and fresh toppings.")
                        .image("https://www.mexicantears.de/images/burger-lang.jpg")
                        .portions(1)
                        .preparation("Grill beef patty. Add cheese and bacon. Assemble with toppings.")
                        .cookingTime(25)
                        .calories(800)
                        .fat(50)
                        .carbohydrates(40)
                        .protein(45)
                        .isPublic(true)
                        .build(),

                Recipe.builder()
                        .userId(userId)
                        .name("Red Curry with Crispy Chicken")
                        .description("Spicy red curry with crispy chicken and vegetables.")
                        .image("https://www.grillfuerst.de/magazin/wp-content/uploads/2023/04/rotes-thai-curry-rezept.jpg")
                        .portions(2)
                        .preparation("Cook chicken. Add curry paste and coconut milk. Simmer with vegetables.")
                        .cookingTime(30)
                        .calories(500)
                        .fat(20)
                        .carbohydrates(40)
                        .protein(30)
                        .isPublic(true)
                        .build(),

                Recipe.builder()
                        .userId(userId)
                        .name("Schnitzel with Spätzle and Creamy Sauce")
                        .description("Breaded pork cutlet served with spätzle and creamy sauce.")
                        .image("https://heimatschwarzwald.de/assets/Uploads/MicrosoftTeams-image-21__FocusFillWzE0MDAsMTEwMCwieSIsMjA2XQ.png")
                        .portions(2)
                        .preparation("Fry schnitzel. Cook spätzle. Make creamy sauce.")
                        .cookingTime(40)
                        .calories(600)
                        .fat(35)
                        .carbohydrates(45)
                        .protein(40)
                        .isPublic(true)
                        .build(),

                Recipe.builder()
                        .userId(userId)
                        .name("Tarte Flambée")
                        .description("Thin french flatbread topped with crème fraîche, onions, and bacon.")
                        .image("https://www.einfachbacken.de/sites/einfachbacken.de/files/styles/full_width_tablet_4_3/public/2020-04/flammkuchen.jpg?h=4521fff0&itok=MzvaQAse")
                        .portions(4)
                        .preparation("Roll out dough. Spread crème fraîche. Add onions and bacon.")
                        .cookingTime(20)
                        .calories(400)
                        .fat(20)
                        .carbohydrates(40)
                        .protein(10)
                        .isPublic(true)
                        .build(),

                Recipe.builder()
                        .userId(userId)
                        .name("Italian Salad")
                        .description("Fresh salad with ham, cheese, eggs and Italian dressing.")
                        .image("https://www.lowcarbrezepte.org/images/img/knackiger-salat-mit-schinken-und-kaese.jpg")
                        .portions(2)
                        .preparation("Chop vegetables. Add ham, cheese, and eggs. Drizzle with dressing.")
                        .cookingTime(15)
                        .calories(300)
                        .fat(15)
                        .carbohydrates(20)
                        .protein(20)
                        .isPublic(true)
                        .build()
        );

        for (Recipe recipe : recipes) {
            List<Ingredient> ingredients = List.of(
                    new Ingredient(null, recipe, "Salt", 1, "tsp"),
                    new Ingredient(null, recipe, "Olive Oil", 1, "tbsp"),
                    new Ingredient(null, recipe, "Ingredient A", 2, "pcs")
            );

            recipe.setIngredients(ingredients);
        }

        recipeRepository.saveAll(recipes);
    }

}
