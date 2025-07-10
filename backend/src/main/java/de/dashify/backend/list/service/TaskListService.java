package de.dashify.backend.list.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.dashify.backend.list.persistance.ListItem;
import de.dashify.backend.list.persistance.ListType;
import de.dashify.backend.list.persistance.TaskList;
import de.dashify.backend.list.persistance.TaskListRepository;

@Service
public class TaskListService {
    private final TaskListRepository taskListRepository;

    public TaskListService(TaskListRepository taskListRepository) {
        this.taskListRepository = taskListRepository;
    }

    @Transactional
    public List<TaskList> getAllTaskLists(Long userId) {
        return taskListRepository.findAllByUserId(userId);
    }

    @Transactional
    public List<TaskList> getTaskListsByType(String type, Long userId) {
        if (!type.equals(ListType.TODO.getLabel()) && !type.equals(ListType.SHOPPING.getLabel())) {
            return Collections.emptyList();
        }
        return taskListRepository.getTaskListsByTypeAndUserId(ListType.valueOf(type), userId);
    }

    @Transactional
    public ResponseEntity<?> getTaskListById(Long id, Long userId) {
        TaskList taskList = taskListRepository.findById(id).orElse(null);
        if (taskList == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Could not find taskList with id " + id);
        }
        if (!taskList.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You do not have permission to access the task list with id " + id);
        }
        return ResponseEntity.ok(taskList);
    }

    @Transactional
    public TaskList createTaskList(TaskList taskList, Long userId) {
        taskList.setUserId(userId);
        return taskListRepository.save(taskList);
    }

    @Transactional
    public ResponseEntity<?> updateTaskList(Long id, TaskList taskList, Long userId) {
        TaskList oldTaskList = taskListRepository.findById(id).orElse(null);

        if (oldTaskList == null) {
            return ResponseEntity.ok("Could not find taskList with id " + id);
        }
        if (!oldTaskList.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You do not have permission to access the task list with id " + id);
        }

        oldTaskList.setName(taskList.getName());
        oldTaskList.setType(taskList.getType());
        oldTaskList.setIcon(taskList.getIcon());

        // WICHTIG: Liste nicht direkt ersetzen!
        oldTaskList.getItems().clear();
        if (taskList.getItems() != null) {
            for (ListItem item : taskList.getItems()) {
                item.setListId(oldTaskList.getId()); // wichtig: Beziehung setzen!
                oldTaskList.getItems().add(item);
            }
        }

        taskListRepository.save(oldTaskList);
        return ResponseEntity.ok("TaskList updated");
    }

    @Transactional
    public ResponseEntity<?> deleteTaskList(Long id, Long userId) {
        TaskList optionalTaskList = taskListRepository.findById(id).orElse(null);
        if (optionalTaskList == null) {
            return ResponseEntity.ok("Could not find taskList with id " + id);
        }
        if (!optionalTaskList.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You do not have permission to access the task list with id " + id);
        }
        taskListRepository.deleteTaskListById(id);
        return ResponseEntity.ok().body("Deleted task list");
    }

    @Transactional
    public void createSampleTaskList(Long userId) {
        TaskList todoTaskList = new TaskList();
        todoTaskList.setUserId(userId);
        todoTaskList.setName("Sample TODOs");
        todoTaskList.setType(ListType.TODO);
        todoTaskList.setIcon(null);
        todoTaskList.setItems(new ArrayList<>());
        todoTaskList = taskListRepository.save(todoTaskList);

        List<ListItem> todoItems = new ArrayList<>(List.of(
                ListItem.builder()
                        .text("Erste TODO's")
                        .done(false)
                        .listId(todoTaskList.getId())
                        .build(),
                ListItem.builder()
                        .text("Hier können wie alle ihre TODO's festhalten")
                        .done(false)
                        .listId(todoTaskList.getId())
                        .build()
        ));
        todoTaskList.setItems(todoItems);
        taskListRepository.save(todoTaskList);

        TaskList shoppingTaskList = new TaskList();
        shoppingTaskList.setUserId(userId);
        shoppingTaskList.setName("Shopping");
        shoppingTaskList.setType(ListType.SHOPPING);
        shoppingTaskList.setIcon("FaCartShopping");
        shoppingTaskList.setItems(new ArrayList<>());
        shoppingTaskList = taskListRepository.save(shoppingTaskList);

        List<ListItem> shoppingItems = new ArrayList<>(List.of(
                ListItem.builder()
                        .text("Milch")
                        .done(false)
                        .listId(shoppingTaskList.getId())
                        .build(),
                ListItem.builder()
                        .text("Brot")
                        .done(false)
                        .listId(shoppingTaskList.getId())
                        .build(),
                ListItem.builder()
                        .text("Wurst")
                        .done(false)
                        .listId(shoppingTaskList.getId())
                        .build(),
                ListItem.builder()
                        .text("Marmelade")
                        .done(false)
                        .listId(shoppingTaskList.getId())
                        .build(),
                ListItem.builder()
                        .text("Eier")
                        .done(false)
                        .listId(shoppingTaskList.getId())
                        .build(),
                ListItem.builder()
                        .text("Käse")
                        .done(false)
                        .listId(shoppingTaskList.getId())
                        .build(),
                ListItem.builder()
                        .text("Apfel")
                        .done(false)
                        .listId(shoppingTaskList.getId())
                        .build(),
                ListItem.builder()
                        .text("Nudeln")
                        .done(false)
                        .listId(shoppingTaskList.getId())
                        .build(),
                ListItem.builder()
                        .text("Butter")
                        .done(false)
                        .listId(shoppingTaskList.getId())
                        .build(),
                ListItem.builder()
                        .text("Joghurt")
                        .done(false)
                        .listId(shoppingTaskList.getId())
                        .build()
        ));
        shoppingTaskList.setItems(shoppingItems);
        taskListRepository.save(shoppingTaskList);
    }
}
