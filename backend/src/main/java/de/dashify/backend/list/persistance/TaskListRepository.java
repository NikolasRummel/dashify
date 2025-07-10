package de.dashify.backend.list.persistance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskListRepository extends JpaRepository<TaskList, Long> {
    void deleteTaskListById(Long id);

    List<TaskList> getTaskListsByTypeAndUserId(ListType type, Long userId);

    List<TaskList> findAllByUserId(Long userId);
}
