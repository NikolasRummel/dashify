package de.dashify.backend.recipies.persistance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    @Query(value = """
    SELECT *
    FROM recipes
    WHERE
        (name ILIKE CONCAT('%', :query, '%') OR similarity(name, :query) > 0.3)
        AND (
            (:searchInPrivate = true AND user_id = :userId)
            OR (:searchInPrivate = false AND is_public = true)
        )
    ORDER BY GREATEST(similarity(name, :query), 0.0) DESC
    LIMIT 50
""", nativeQuery = true)
    List<Recipe> searchByTitleFuzzy(
            @Param("query") String query,
            @Param("userId") Long userId,
            @Param("searchInPrivate") boolean searchInPrivate
    );

    @Query(value = """
    SELECT r.id, r.name
    FROM recipes r
    WHERE
        (name ILIKE CONCAT('%', :query, '%') OR similarity(name, :query) > 0.3)
        AND (
            (:searchInPrivate = true AND user_id = :userId)
            OR (:searchInPrivate = false AND is_public = true)
        )
    ORDER BY GREATEST(similarity(name, :query), 0.0) DESC
    LIMIT 10
""", nativeQuery = true)
    List<Object[]> searchTitleSuggestions(
            @Param("query") String query,
            @Param("userId") Long userId,
            @Param("searchInPrivate") boolean searchInPrivate
    );

    @Query(value = "SELECT * FROM recipes WHERE is_public = true ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    Recipe findRandomPublicRecipe();

    @Modifying
    @Transactional
    @Query(value = """
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
    CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
    """, nativeQuery = true)
    void enableFuzzySearch();

    List<Recipe> findAllByUserId(Long userId);

}
