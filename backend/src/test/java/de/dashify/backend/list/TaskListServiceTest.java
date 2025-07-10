package de.dashify.backend.list;

import de.dashify.backend.auth.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import de.dashify.backend.list.persistance.TaskList;
import de.dashify.backend.list.persistance.ListType;
import de.dashify.backend.list.persistance.TaskListRepository;
import de.dashify.backend.list.service.TaskListService;

@ExtendWith(MockitoExtension.class)
class TaskListServiceTest {

    @Mock
    private TaskListRepository taskListRepository;

    @InjectMocks
    private TaskListService taskListService;

    private TaskList sampleList;

    private UserDetailsImpl testUser;

    @BeforeEach
    void setUp() {
        testUser = new UserDetailsImpl(1L, "user", "email", "pass");
        sampleList = new TaskList();
        sampleList.setId(2L);
        sampleList.setName("My Tasks");
        sampleList.setType(ListType.TODO);
        sampleList.setIcon("📝");
        sampleList.setUserId(testUser.getId());
        sampleList.setItems(new ArrayList<>());
    }

    @Test
    void testGetAllTaskLists() {
        when(taskListRepository.findAllByUserId(testUser.getId())).thenReturn(List.of(sampleList));

        List<TaskList> result = taskListService.getAllTaskLists(testUser.getId());

        assertEquals(1, result.size());
        assertEquals(sampleList, result.get(0));
    }

    @Test
    void testGetTaskListsByType() {
        when(taskListRepository.getTaskListsByTypeAndUserId(ListType.TODO, testUser.getId())).thenReturn(List.of(sampleList));

        List<TaskList> result = taskListService.getTaskListsByType("TODO", testUser.getId());

        assertEquals(1, result.size());
        assertEquals(sampleList, result.get(0));
    }

    @Test
    void testGetTaskListById_found() {
        when(taskListRepository.findById(1L)).thenReturn(Optional.of(sampleList));

        ResponseEntity<?> response = taskListService.getTaskListById(1L, testUser.getId());

        assertEquals(200, response.getStatusCode().value());
        assertEquals(sampleList, response.getBody());
    }

    @Test
    void testGetTaskListById_notFound() {
        when(taskListRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = taskListService.getTaskListById(99L, testUser.getId());

        assertEquals(404, response.getStatusCode().value());
        assertEquals("Could not find taskList with id 99", response.getBody());
    }

    @Test
    void testCreateTaskList() {
        when(taskListRepository.save(sampleList)).thenReturn(sampleList);

        TaskList result = taskListService.createTaskList(sampleList, testUser.getId());

        assertEquals(sampleList, result);
    }

    @Test
    void testUpdateTaskList_found() {
        TaskList updated = new TaskList();
        updated.setName("Updated");
        updated.setType(ListType.SHOPPING);
        updated.setIcon("💼");
        updated.setItems(new ArrayList<>());

        when(taskListRepository.findById(1L)).thenReturn(Optional.of(sampleList));

        ResponseEntity<?> response = taskListService.updateTaskList(1L, updated, testUser.getId());

        assertEquals(200, response.getStatusCode().value());
        assertEquals("TaskList updated", response.getBody());
        verify(taskListRepository).save(any(TaskList.class));
    }

    @Test
    void testUpdateTaskList_notFound() {
        when(taskListRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = taskListService.updateTaskList(1L, sampleList, testUser.getId());

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Could not find taskList with id 1", response.getBody());
    }

    @Test
    void testDeleteTaskList_found() {
        when(taskListRepository.findById(1L)).thenReturn(Optional.of(sampleList));

        ResponseEntity<?> response = taskListService.deleteTaskList(1L, testUser.getId());

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Deleted task list", response.getBody());
        verify(taskListRepository).deleteTaskListById(1L);
    }

    @Test
    void testDeleteTaskList_notFound() {
        when(taskListRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = taskListService.deleteTaskList(1L, testUser.getId());

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Could not find taskList with id 1", response.getBody());
        verify(taskListRepository, never()).deleteTaskListById(any());
    }
}
