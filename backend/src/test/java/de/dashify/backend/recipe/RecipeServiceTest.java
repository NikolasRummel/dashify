package de.dashify.backend.recipe;

import de.dashify.backend.auth.security.services.UserDetailsImpl;
import de.dashify.backend.recipies.RecipeService;
import de.dashify.backend.recipies.persistance.Ingredient;
import de.dashify.backend.recipies.persistance.Recipe;
import de.dashify.backend.recipies.persistance.RecipeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RecipeServiceTest {

    @Mock
    private RecipeRepository recipeRepository;

    @InjectMocks
    private RecipeService recipeService;

    private UserDetailsImpl testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testUser = new UserDetailsImpl(1L, "user", "email", "pass");
    }

    @Test
    void createRecipe_shouldSaveRecipeWithUserId() {
        Recipe recipe = Recipe.builder()
                .name("Test Recipe")
                .ingredients(List.of(new Ingredient(null, null, "Salt", 1, "tsp")))
                .build();

        when(recipeRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        ResponseEntity<?> response = recipeService.createRecipe(testUser, recipe);

        Recipe saved = (Recipe) response.getBody();

        assertNotNull(saved);
        assertEquals(1L, saved.getUserId());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(saved.getIngredients().get(0).getRecipe(), saved);
    }

    @Test
    void getRecipe_shouldReturnRecipe_ifPublic() {
        Recipe recipe = Recipe.builder().id(1L).isPublic(true).build();
        when(recipeRepository.findById(1L)).thenReturn(Optional.of(recipe));

        ResponseEntity<?> response = recipeService.getRecipe(1L, testUser);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(recipe, response.getBody());
    }

    @Test
    void getRecipe_shouldReturn403_ifPrivateAndNotOwner() {
        Recipe recipe = Recipe.builder().id(1L).isPublic(false).userId(2L).build();
        when(recipeRepository.findById(1L)).thenReturn(Optional.of(recipe));

        ResponseEntity<?> response = recipeService.getRecipe(1L, testUser);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    void updateRecipe_shouldReturn404_ifNotFound() {
        when(recipeRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = recipeService.updateRecipe(1L, testUser, new Recipe());
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void deleteRecipe_shouldReturnSuccess_ifOwner() {
        Recipe recipe = Recipe.builder().id(1L).userId(1L).build();
        when(recipeRepository.findById(1L)).thenReturn(Optional.of(recipe));

        ResponseEntity<?> response = recipeService.deleteRecipe(1L, testUser);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(recipeRepository).delete(recipe);
    }

    @Test
    void duplicateRecipe_shouldCopyIngredients_andSetNewOwner() {
        Recipe original = Recipe.builder()
                .id(1L)
                .userId(2L)
                .isPublic(true)
                .name("Original")
                .ingredients(List.of(new Ingredient(null, null, "Salt", 1, "tsp")))
                .build();

        when(recipeRepository.findById(1L)).thenReturn(Optional.of(original));
        when(recipeRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        ResponseEntity<?> response = recipeService.duplicateRecipe(1L, testUser);
        Recipe dup = (Recipe) response.getBody();

        assertNotNull(dup);
        assertEquals("Original (Copy)", dup.getName());
        assertEquals(testUser.getId(), dup.getUserId());
        assertFalse(dup.getIsPublic());
        assertEquals(1, dup.getIngredients().size());
    }

    @Test
    void getRandomRecipe_shouldReturn404_ifNull() {
        when(recipeRepository.findRandomPublicRecipe()).thenReturn(null);

        ResponseEntity<?> response = recipeService.getRandomRecipe();
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getAllPublicRecipes_shouldReturnOnlyPublic() {
        Recipe publicRecipe = Recipe.builder().id(1L).isPublic(true).build();
        Recipe privateRecipe = Recipe.builder().id(2L).isPublic(false).build();
        when(recipeRepository.findAll()).thenReturn(List.of(publicRecipe, privateRecipe));

        ResponseEntity<?> response = recipeService.getAllPublicRecipes();
        List<?> result = (List<?>) response.getBody();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.contains(publicRecipe));
    }
}
