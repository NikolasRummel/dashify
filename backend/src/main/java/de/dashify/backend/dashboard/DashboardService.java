package de.dashify.backend.dashboard;

import de.dashify.backend.auth.security.services.UserDetailsImpl;
import de.dashify.backend.dashboard.widgets.Widget;
import de.dashify.backend.dashboard.widgets.WidgetType;
import de.dashify.backend.user.persistance.User;
import de.dashify.backend.user.persistance.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class DashboardService {

    private final DashboardRepository dashboardRepository;
    private final UserRepository userRepository;

    public Dashboard getDashboardById(Long id) {
        return dashboardRepository.findById(id)
                .orElse(null);
    }

    public ArrayList<Dashboard> getAllDashboardsForUserId(Long userId) {
        return dashboardRepository.findAllDashboardsOwnedOrSharedWithUser(userId);
    }

    public ResponseEntity<?> createDashboard(UserDetailsImpl userDetails, Dashboard dashboard) {
        dashboard.setUserId(userDetails.getId());
        return ResponseEntity.ok(dashboardRepository.save(dashboard));
    }

    @Transactional
    public ResponseEntity<?> updateDashboard(UserDetailsImpl userDetails, Dashboard dashboardRequest, Long id) {
        Optional<Dashboard> dashboardOptional = dashboardRepository.findById(id);

        if (dashboardOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("You cannot update a dashboard which doesnt exist.");
        }

        boolean isOwner = dashboardOptional.get().getUserId().equals(userDetails.getId());
        boolean isShared = dashboardOptional.get().getSharedWithUsers().stream()
                .anyMatch(user -> user.getId().equals(userDetails.getId()));

        if (!isOwner && !isShared) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You cannot update this dashboard!");
        }

        Dashboard dashboard = dashboardOptional.get();
        dashboard.setName(dashboardRequest.getName() != null ? dashboardRequest.getName() : dashboard.getName());
        dashboard.setWidth(dashboardRequest.getWidth() != 0 ? dashboardRequest.getWidth() : dashboard.getWidth());
        dashboard.setHeight(dashboardRequest.getHeight() != 0 ? dashboardRequest.getHeight() : dashboard.getHeight());

        return ResponseEntity.ok(dashboardRepository.save(dashboard));
    }

    @Transactional
    public ResponseEntity<?> deleteDashboardById(UserDetailsImpl userDetails, Long dashboardId) {
        Optional<Dashboard> dashboardOptional = dashboardRepository.findById(dashboardId);
        if (dashboardOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("You cannot delete a dashboard which doesnt exist.");
        }
        if (!dashboardOptional.get().getUserId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You cannot delete this dashboard!");
        }

        dashboardRepository.deleteById(dashboardId);
        return ResponseEntity.ok().build();

    }

    //WIDGETS
    @Transactional
    public ResponseEntity<?> saveWidgetsForDashboard(UserDetailsImpl userDetails, Long dashboardId, List<Widget> widgets) {
        Dashboard dashboard = dashboardRepository.findById(dashboardId)
                .orElseThrow(() -> new RuntimeException("Dashboard not found"));

        boolean isOwner = dashboard.getUserId().equals(userDetails.getId());
        boolean isShared = dashboard.getSharedWithUsers().stream()
                .anyMatch(user -> user.getId().equals(userDetails.getId()));

        if (!isOwner && !isShared) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You cannot save widgets on this dashboard");
        }

        dashboard.getWidgets().clear();
        
        for (Widget widget : widgets) {
            widget.setDashboard(dashboard);
            dashboard.getWidgets().add(widget);
        }

        Dashboard savedDashboard = dashboardRepository.save(dashboard);
        
        // Return simplified response to avoid circular references
        return ResponseEntity.ok().body(savedDashboard);
    }

    public ResponseEntity<?> shareDashboardWithUser(Long dashboardId, Long userId) {
        Dashboard dashboard = dashboardRepository.findById(dashboardId)
                .orElseThrow(() -> new RuntimeException("Dashboard not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.getDashboards().add(dashboard);
        userRepository.save(user);
        
        return ResponseEntity.ok("Dashboard shared successfully");
    }

    @Transactional
    public void createSampleDashboard(Long userId) {
        Dashboard sampleDashboard = new Dashboard();
        sampleDashboard.setUserId(userId);
        sampleDashboard.setName("Default");
        sampleDashboard.setHeight(3);
        sampleDashboard.setWidth(6);

        sampleDashboard.setWidgets(List.of(
                Widget.builder()
                        .h(1)
                        .w(1)
                        .x(0)
                        .y(0)
                        .type(WidgetType.CLOCK)
                        .dashboard(sampleDashboard)
                        .build(),

                Widget.builder()
                        .h(1)
                        .w(2)
                        .x(1)
                        .y(0)
                        .type(WidgetType.MENU)
                        .dashboard(sampleDashboard)
                        .build(),

                Widget.builder()
                        .h(2)
                        .w(2)
                        .x(3)
                        .y(0)
                        .type(WidgetType.WEATHER)
                        .dashboard(sampleDashboard)
                        .build(),

                Widget.builder()
                        .h(1)
                        .w(1)
                        .x(5)
                        .y(0)
                        .type(WidgetType.DEBUG)
                        .dashboard(sampleDashboard)
                        .build(),

                Widget.builder()
                        .h(2)
                        .w(2)
                        .x(0)
                        .y(1)
                        .type(WidgetType.LIST)
                        .dashboard(sampleDashboard)
                        .build(),

                Widget.builder()
                        .h(1)
                        .w(1)
                        .x(2)
                        .y(1)
                        .type(WidgetType.BATTERY)
                        .dashboard(sampleDashboard)
                        .build(),

                Widget.builder()
                        .h(1)
                        .w(1)
                        .x(5)
                        .y(1)
                        .type(WidgetType.MAP)
                        .dashboard(sampleDashboard)
                        .build(),

                Widget.builder()
                        .h(1)
                        .w(2)
                        .x(2)
                        .y(2)
                        .type(WidgetType.MEAL_PLAN)
                        .dashboard(sampleDashboard)
                        .build(),

                Widget.builder()
                        .h(1)
                        .w(2)
                        .x(4)
                        .y(2)
                        .type(WidgetType.RECIPE)
                        .dashboard(sampleDashboard)
                        .build()
                )
        );
        dashboardRepository.save(sampleDashboard);
    }
}
