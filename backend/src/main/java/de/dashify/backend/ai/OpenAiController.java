package de.dashify.backend.ai;

import de.dashify.backend.auth.security.services.UserDetailsImpl;
import de.dashify.backend.recipies.persistance.Recipe;
import de.dashify.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai/recipes")
@RequiredArgsConstructor
public class OpenAiController {

    private final OpenAiService openAiService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> generateRecipeFromPrompt(@RequestParam String query, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        ResponseEntity<?> response = userService.increaseCounter(userDetails.getId());
        if (response.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.ok(openAiService.generateRecipeFromPrompt(query));
        }
        return response;
    }
}
