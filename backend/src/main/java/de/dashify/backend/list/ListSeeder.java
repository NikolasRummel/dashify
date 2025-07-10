package de.dashify.backend.list;

import de.dashify.backend.list.persistance.TaskList;
import de.dashify.backend.list.service.TaskListService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ListSeeder implements CommandLineRunner {

    private final TaskListService taskListService;

    public void run(String... args) throws Exception {
        Long testUserId = 1L;

        List<TaskList> taskLists = taskListService.getAllTaskLists(testUserId);
        if (!taskLists.isEmpty()) {
            System.out.println("✅ TaskList already exist for user with ID: " + testUserId);
            return;
        }

        taskListService.createSampleTaskList(testUserId);
        System.out.println("✅ Sample TaskList seeded on startup!");
    }
}
