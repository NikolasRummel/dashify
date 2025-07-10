package de.dashify.backend.dashboard;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;
import java.util.Optional;

public interface DashboardRepository extends JpaRepository<Dashboard, Integer> {
    Optional<Dashboard> findById(Long id);
    ArrayList<Dashboard> getAllDashboardsByUserIdOrderByCreatedAt(Long userId);
    void deleteById(Long id);
    
    @Query(value = """
            SELECT d FROM Dashboard
            d LEFT JOIN d.sharedWithUsers u 
            WHERE d.userId = :userId OR u.id = :userId
            ORDER BY d.createdAt
    """)
    ArrayList<Dashboard> findAllDashboardsOwnedOrSharedWithUser(@Param("userId") Long userId);
}
