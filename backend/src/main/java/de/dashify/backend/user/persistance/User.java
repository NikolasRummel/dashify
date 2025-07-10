package de.dashify.backend.user.persistance;

import de.dashify.backend.dashboard.Dashboard;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String username;

    private String password;

    private UserLanguage language;

    private String accentColor;

    private String backgroundImage;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String profilePicture;

    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private int aiTryCount;

    @ManyToMany
    @JoinTable(
            name = "user_dashboard",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "dashboard_id")
    )
    private Set<Dashboard> dashboards = new HashSet<>();

    public User(String email, String username, String password, UserLanguage language) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.language = language;
        this.accentColor = "auto";
        this.backgroundImage = "/wallpapers/12.jpg";
        this.profilePicture = "/img/default-profile-image.svg";
        this.aiTryCount = 0;
    }

    public void resetCount() {
        aiTryCount = 0;
    }
}
