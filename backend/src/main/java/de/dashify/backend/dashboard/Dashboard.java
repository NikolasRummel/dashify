package de.dashify.backend.dashboard;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.dashify.backend.dashboard.widgets.Widget;
import de.dashify.backend.user.persistance.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@Table(name = "dashboard")
@AllArgsConstructor
@NoArgsConstructor
public class Dashboard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String name;
    private int width;
    private int height;

    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "dashboard", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Widget> widgets = new ArrayList<>();

    @JsonIgnore
    @ManyToMany(mappedBy = "dashboards")
    private Set<User> sharedWithUsers = new HashSet<>();

    public Dashboard(Long userId, String name, int width, int height) {
        this.userId = userId;
        this.name = name;
        this.width = width;
        this.height = height;
    }
}
