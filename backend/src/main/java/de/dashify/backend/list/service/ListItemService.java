package de.dashify.backend.list.service;

import de.dashify.backend.list.persistance.ListItem;
import de.dashify.backend.list.persistance.ListItemRepository;
import de.dashify.backend.list.persistance.TaskList;
import de.dashify.backend.list.persistance.TaskListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ListItemService {
    private final ListItemRepository repository;
    private final TaskListRepository taskListRepository;

    @Transactional
    public ResponseEntity<?> getAllListItems(Long listId, Long userId) {
        return ResponseEntity.ok(repository.getAllListItemsOfListByTasklistIdAndUserId(listId, userId));
    }

    @Transactional
    public ResponseEntity<?> getListItemById(Long id, Long userId) {
        ListItem listItem = repository.findById(id).orElse(null);
        if (listItem == null || listItem.getId() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not find ListItem with id " + id);
        }
        TaskList taskList = taskListRepository.findById(listItem.getListId()).orElse(null);
        if (taskList == null || !Objects.equals(taskList.getUserId(), userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You do not have permission to access this list nor its items");
        }
        return ResponseEntity.ok(repository.findById(id));
    }

    @Transactional
    public ResponseEntity<?> getAllListItemsByStatus(Boolean status, Long userId) {
        List<ListItem> items = repository.getAllListItemsByStatus(status).stream().toList();
        if (items.isEmpty()) {
            return ResponseEntity.ok(Optional.empty());
        }
        for (ListItem item : items) {
            TaskList taskList = taskListRepository.findById(item.getListId()).orElse(null);
            if (taskList == null || !Objects.equals(taskList.getUserId(), userId)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You do not have permission to access this list nor its items");
            }
        }
        return ResponseEntity.ok(items);
    }

    @Transactional
    public ResponseEntity<?> createListItem(ListItem item) {
        return ResponseEntity.ok(repository.save(item));
    }

    @Transactional
    public ResponseEntity<?> updateListItem(Long id, ListItem item, Long userId) {
        ListItem savedItem = repository.findById(id).orElse(null);

        if (savedItem == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not find ListItem with id " + id);
        }

        TaskList taskList = taskListRepository.findById(savedItem.getListId()).orElse(null);
        if (taskList == null || !Objects.equals(taskList.getUserId(), userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You do not have permission to access this list nor its items");
        }

        savedItem.setText(item.getText());
        savedItem.setDone(item.isDone());
        savedItem.setDeadline(item.getDeadline());
        savedItem.setListId(item.getListId());
        repository.save(savedItem);
        return ResponseEntity.ok("List Item with id " + id + " updated");
    }

    @Transactional
    public ResponseEntity<?> deleteListItem(Long id, Long userId) {
        ListItem savedItem = repository.findById(id).orElse(null);

        if (savedItem == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not find ListItem with id " + id);
        }
        TaskList taskList = taskListRepository.findById(savedItem.getListId()).orElse(null);
        if (taskList == null || !Objects.equals(taskList.getUserId(), userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You do not have permission to access this list nor its items");
        }
        repository.delete(savedItem);
        return ResponseEntity.ok("List Item with id " + id + " deleted");
    }
}
