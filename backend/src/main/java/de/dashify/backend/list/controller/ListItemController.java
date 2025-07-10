package de.dashify.backend.list.controller;

import de.dashify.backend.auth.security.services.UserDetailsImpl;
import de.dashify.backend.list.persistance.ListItem;
import de.dashify.backend.list.service.ListItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lists/items")
@RequiredArgsConstructor
public class ListItemController {
    private final ListItemService listItemService;

    @GetMapping("/all/{listId}")
    public ResponseEntity<?> getAllListItems(@PathVariable Long listId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(listItemService.getAllListItems(listId, userDetails.getId()));
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<?> getListItem(@PathVariable Long itemId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(listItemService.getListItemById(itemId, userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<?> createListItem(@RequestBody ListItem itemRequest) {
        return ResponseEntity.ok(listItemService.createListItem(itemRequest));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<?> updateListItem(@PathVariable Long itemId, @RequestBody ListItem itemUpdateRequest, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(listItemService.updateListItem(itemId, itemUpdateRequest, userDetails.getId()));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> deleteListItem(@PathVariable Long itemId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(listItemService.deleteListItem(itemId, userDetails.getId()));
    }
}
