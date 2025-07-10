package de.dashify.backend.list.persistance;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "list_items")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ListItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;

    private boolean done;

    private Date deadline;

    private Long listId;
}
