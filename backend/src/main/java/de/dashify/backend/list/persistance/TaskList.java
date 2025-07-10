package de.dashify.backend.list.persistance;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "lists")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private ListType type;

    private String icon;

    private Long userId;

    @OneToMany(mappedBy = "listId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ListItem> items;

}
