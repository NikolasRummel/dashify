package de.dashify.backend.dashboard;

import de.dashify.backend.auth.security.services.UserDetailsImpl;
import de.dashify.backend.dashboard.widgets.Widget;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboards")
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;

    /**
     * @return all dashboards of a user
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllDashboardsForUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(dashboardService.getAllDashboardsForUserId(userDetails.getId()));
    }

    /**
     * @param id id of dashboard
     * @return dashboard that belongs to given id
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getDashboardById(@PathVariable Long id) {
        return ResponseEntity.ok(dashboardService.getDashboardById(id));
    }

    /**
     * @param dashboard dashboard that should be created
     * @return response message if create was successful
     */
    @PostMapping("/create")
    public ResponseEntity<?> createDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody Dashboard dashboard) {
        return dashboardService.createDashboard(userDetails, dashboard);
    }

    /**
     * @param dashboard dashboard that should be updated
     * @return response message if update was successful
     */
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody Dashboard dashboard, @PathVariable Long id) {
        return dashboardService.updateDashboard(userDetails, dashboard, id);
    }

    /**
     * NOT TESTED!
     * @param id dashboards that should be deleted
     * @return response message if delete was successful
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable Long id) {
        return dashboardService.deleteDashboardById(userDetails, id);
    }


    @PostMapping("/{id}/widgets")
    public ResponseEntity<?> saveWidgetsForDashboard(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id,
            @RequestBody List<Widget> widgets
    ) {
        return dashboardService.saveWidgetsForDashboard(userDetails, id, widgets);
    }

    @PostMapping("/{dashboardId}/share/{userId}")
    public ResponseEntity<?> shareDashboard(@PathVariable Long dashboardId, @PathVariable Long userId) {
        return ResponseEntity.ok(dashboardService.shareDashboardWithUser(dashboardId, userId));
    }
}
