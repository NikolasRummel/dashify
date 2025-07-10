package de.dashify.backend.list;

import de.dashify.backend.auth.security.services.UserDetailsImpl;
import de.dashify.backend.list.persistance.ListItem;
import de.dashify.backend.list.persistance.ListItemRepository;
import de.dashify.backend.list.persistance.TaskList;
import de.dashify.backend.list.persistance.TaskListRepository;
import de.dashify.backend.list.service.ListItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ListItemServiceTest {
    @Mock
    private ListItemRepository repository;

    @Mock
    private TaskListRepository taskListRepository;

    @InjectMocks
    private ListItemService service;

    private UserDetailsImpl testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testUser = new UserDetailsImpl(1L, "user", "email", "pass");
    }

    private ListItem createSampleItem(Long id, String text, boolean done, Date deadline, Long taskListId) {
        TaskList taskList = new TaskList();
        taskList.setId(taskListId);
        taskList.setUserId(testUser.getId());

        ListItem item = new ListItem();
        item.setId(id);
        item.setText(text);
        item.setDone(done);
        item.setDeadline(deadline);
        item.setListId(taskList.getId());

        return item;
    }

    @Test
    void testGetAllListItems() {
        ListItem item1 = createSampleItem(1L, "Item 1", false, new Date(), 100L);
        ListItem item2 = createSampleItem(2L, "Item 2", true, new Date(), 100L);
        when(repository.getAllListItemsOfListByTasklistIdAndUserId(100L, testUser.getId())).thenReturn(Optional.of(List.of(item1, item2)));

        ResponseEntity<?> response = service.getAllListItems(100L, testUser.getId());

        assertEquals(200, response.getStatusCode().value());
        assertEquals(Optional.of(List.of(item1, item2)), response.getBody());
    }

    @Test
    void testGetListItemById_found() {
        TaskList taskList = new TaskList();
        taskList.setId(200L);
        taskList.setUserId(testUser.getId());
        ListItem item = createSampleItem(1L, "Test", true, new Date(), taskList.getId());

        when(repository.findById(1L)).thenReturn(Optional.of(item));
        when(taskListRepository.findById(200L)).thenReturn(Optional.of(taskList));

        ResponseEntity<?> response = service.getListItemById(1L, testUser.getId());

        assertNotNull(response.getBody());
        assertEquals(200, response.getStatusCode().value());
        assertTrue(((Optional<?>) response.getBody()).isPresent());
    }

    @Test
    void testGetListItemById_notFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = service.getListItemById(1L, testUser.getId());

        assertEquals(404, response.getStatusCode().value());
        assertEquals("Could not find ListItem with id 1", response.getBody());
    }

    @Test
    void testGetAllListItemsByStatus_found() {
        TaskList taskList = new TaskList();
        taskList.setId(200L);
        taskList.setUserId(testUser.getId());
        ListItem item = createSampleItem(1L, "Done item", true, new Date(), taskList.getId());
        ArrayList<ListItem> items = new ArrayList<>();
        items.add(item);

        when(repository.getAllListItemsByStatus(true)).thenReturn(Optional.of(item));
        when(taskListRepository.findById(200L)).thenReturn(Optional.of(taskList));

        ResponseEntity<?> response = service.getAllListItemsByStatus(true, testUser.getId());

        assertEquals(200, response.getStatusCode().value());
        assertEquals(items, response.getBody());
    }

    @Test
    void testGetAllListItemsByStatus_notFound() {
        when(repository.getAllListItemsByStatus(false)).thenReturn(Optional.empty());

        ResponseEntity<?> response = service.getAllListItemsByStatus(false, testUser.getId());

        assertEquals(200, response.getStatusCode().value());
        assertEquals(Optional.empty(), response.getBody());
    }

    @Test
    void testCreateListItem() {
        ListItem item = createSampleItem(null, "New item", false, new Date(), 300L);
        when(repository.save(item)).thenReturn(item);

        ResponseEntity<?> response = service.createListItem(item);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(item, response.getBody());
    }

    @Test
    void testUpdateListItem_found() {
        TaskList taskList = new TaskList();
        taskList.setId(200L);
        taskList.setUserId(testUser.getId());
        ListItem existing = createSampleItem(1L, "Old", false, new Date(), taskList.getId());
        ListItem update = createSampleItem(null, "Updated Text", true, new Date(System.currentTimeMillis() + 86400000), 401L); // new Date +1 day

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(taskListRepository.findById(200L)).thenReturn(Optional.of(taskList));

        ResponseEntity<?> response = service.updateListItem(1L, update, testUser.getId());

        assertEquals(200, response.getStatusCode().value());
        assertEquals("List Item with id 1 updated", response.getBody());
        verify(repository).save(existing);

        assertEquals("Updated Text", existing.getText());
        assertTrue(existing.isDone());
        assertEquals(update.getDeadline(), existing.getDeadline());
        assertEquals(update.getListId(), existing.getListId());
    }

    @Test
    void testUpdateListItem_notFound() {
        ListItem update = createSampleItem(null, "New Text", true, new Date(), 401L);
        when(repository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = service.updateListItem(1L, update, testUser.getId());

        assertEquals(404, response.getStatusCode().value());
        assertEquals("Could not find ListItem with id 1", response.getBody());
    }

    @Test
    void testDeleteListItem_found() {
        TaskList taskList = new TaskList();
        taskList.setId(500L);
        taskList.setUserId(testUser.getId());
        ListItem existing = createSampleItem(1L, "To be deleted", false, new Date(), taskList.getId());

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(taskListRepository.findById(500L)).thenReturn(Optional.of(taskList));

        ResponseEntity<?> response = service.deleteListItem(1L, testUser.getId());

        assertEquals(200, response.getStatusCode().value());
        assertEquals("List Item with id 1 deleted", response.getBody());
        verify(repository).delete(existing);
    }

    @Test
    void testDeleteListItem_notFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = service.deleteListItem(1L, testUser.getId());

        assertEquals(404, response.getStatusCode().value());
        assertEquals("Could not find ListItem with id 1", response.getBody());
    }
}