package de.dashify.backend.dashboard.widgets;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.dashify.backend.dashboard.Dashboard;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Data
@Table(name = "widgets")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Widget {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private int h;
    private int w;
    private int x;
    private int y;

    private WidgetType type;

    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> config;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "dashboard_id")
    private Dashboard dashboard;

}
