package de.dashify.backend.ai;

import de.dashify.backend.recipies.persistance.Recipe;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class OpenAiService {

    private final ChatClient chatClient;

    public OpenAiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    Recipe generateRecipeFromPrompt(String query) {
        PromptTemplate pt = new PromptTemplate("""
                Generate a recipe for a dish based on the user input below.
                This input can be some ingredients, a dish name, or a cuisine type.
                Choose the ingredients, cooking method, nutritional values, and
                cooking time accordingly and as realistic and accurate as possible.
                Use metric units for everything.
                """);

        Recipe recipe =  this.chatClient.prompt(pt.create())
                .user(query)
                .call()
                .entity(new ParameterizedTypeReference<>() {
                });

        if (recipe != null) {
            recipe.setId(null);
            recipe.setUserId(null);
            recipe.setCreatedAt(LocalDateTime.now());
            recipe.setUpdatedAt(null);
            recipe.setImage(null);
            recipe.setIsPublic(false);
        }

        return recipe;
    }
}
