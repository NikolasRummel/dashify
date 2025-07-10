package de.dashify.backend.list.controller;

import de.dashify.backend.auth.security.services.UserDetailsImpl;
import de.dashify.backend.list.persistance.TaskList;
import de.dashify.backend.list.service.TaskListService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lists")
@RequiredArgsConstructor
public class ListController {

    @Autowired
    private final TaskListService taskListService;

    @GetMapping("/all")
    public ResponseEntity<List<TaskList>> getAllLists(@RequestParam(required = false) String type, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (type == null) {
            return ResponseEntity.ok(taskListService.getAllTaskLists(userDetails.getId()));
        } else {
            return ResponseEntity.ok(taskListService.getTaskListsByType(type, userDetails.getId()));
        }
    }

    @GetMapping("/{listId}")
    public ResponseEntity<?> getList(@PathVariable Long listId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(taskListService.getTaskListById(listId, userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<?> createList(@RequestBody TaskList taskListRequest, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(taskListService.createTaskList(taskListRequest, userDetails.getId()));
    }

    @PutMapping("/{listId}")
    public ResponseEntity<?> updateList(@PathVariable Long listId, @RequestBody TaskList taskListUpdateRequest, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return taskListService.updateTaskList(listId, taskListUpdateRequest, userDetails.getId());
    }

    @DeleteMapping("/{listId}")
    public ResponseEntity<?> deleteList(@PathVariable Long listId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return taskListService.deleteTaskList(listId, userDetails.getId());
    }
}
