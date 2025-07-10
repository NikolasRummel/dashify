package de.dashify.backend.list.persistance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ListItemRepository extends JpaRepository<ListItem, Long> {
    Optional<ListItem> getListItemsById(Long id);

    @Query(value = """
        SELECT *
        FROM ListItem l
        WHERE l.done = status;
    """, nativeQuery = true)
    Optional<ListItem> getAllListItemsByStatus(
            @Param("status") Boolean status
    );

    @Query(value = """
        SELECT *
        FROM ListItem l
        WHERE l.tasklistid = :listId
        AND l.userid = :userId;
    """, nativeQuery = true)
    Optional<List<ListItem>> getAllListItemsOfListByTasklistIdAndUserId(
            @Param("listId") Long listId,
            @Param("userId") Long userId
    );
}
