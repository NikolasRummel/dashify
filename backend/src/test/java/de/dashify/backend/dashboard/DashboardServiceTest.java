package de.dashify.backend.dashboard;

import de.dashify.backend.auth.security.services.UserDetailsImpl;
import de.dashify.backend.dashboard.widgets.Widget;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DashboardServiceTest {

    @Mock
    private DashboardRepository dashboardRepository;

    @InjectMocks
    private DashboardService dashboardService;

    private UserDetailsImpl testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testUser = new UserDetailsImpl(1L, "user", "email", "pass");
    }

    @Test
    void getDashboardById_shouldReturnDashboard_ifExists() {
        Dashboard dashboard = new Dashboard();
        when(dashboardRepository.findById(1L)).thenReturn(Optional.of(dashboard));

        Dashboard result = dashboardService.getDashboardById(1L);
        assertEquals(dashboard, result);
    }

    @Test
    void getFirstDashboardByUserId_shouldReturnFirstDashboard() {
        Dashboard d1 = new Dashboard(), d2 = new Dashboard();
        when(dashboardRepository.getAllDashboardsByUserIdOrderByCreatedAt(1L))
                .thenReturn(new ArrayList<>(List.of(d1, d2)));

        Dashboard result = dashboardService.getFirstDashboardByUserId(1L);
        assertEquals(d1, result);
    }

    @Test
    void getAllDashboardsByUserId_shouldReturnAll() {
        ArrayList<Dashboard> dashboards = new ArrayList<>(List.of(new Dashboard(), new Dashboard()));
        when(dashboardRepository.getAllDashboardsByUserIdOrderByCreatedAt(1L)).thenReturn(dashboards);

        ArrayList<Dashboard> result = dashboardService.getAllDashboardsForUserId(1L);
        assertEquals(2, result.size());
    }

    @Test
    void createDashboard_shouldSetUserIdAndSave() {
        Dashboard dashboard = new Dashboard();
        when(dashboardRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        ResponseEntity<?> response = dashboardService.createDashboard(testUser, dashboard);

        Dashboard saved = (Dashboard) response.getBody();

        assertNotNull(saved);
        assertEquals(testUser.getId(), saved.getUserId());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void updateDashboard_shouldReturnBadRequest_ifNotFound() {
        when(dashboardRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = dashboardService.updateDashboard(testUser, new Dashboard(), 1L);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void updateDashboard_shouldReturnForbidden_ifNotOwner() {
        Dashboard dashboard = new Dashboard();
        dashboard.setUserId(999L);
        when(dashboardRepository.findById(1L)).thenReturn(Optional.of(dashboard));

        ResponseEntity<?> response = dashboardService.updateDashboard(testUser, new Dashboard(), 1L);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    void updateDashboard_shouldUpdateFields_ifOwner() {
        Dashboard dashboard = new Dashboard();
        dashboard.setUserId(testUser.getId());
        dashboard.setName("Old Name");

        Dashboard request = new Dashboard();
        request.setName("New Name");

        when(dashboardRepository.findById(1L)).thenReturn(Optional.of(dashboard));
        when(dashboardRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        ResponseEntity<?> response = dashboardService.updateDashboard(testUser, request, 1L);

        assertNotNull(response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("New Name", ((Dashboard) response.getBody()).getName());
    }

    @Test
    void deleteDashboardById_shouldReturnBadRequest_ifNotFound() {
        when(dashboardRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = dashboardService.deleteDashboardById(testUser, 1L);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void deleteDashboardById_shouldReturnForbidden_ifNotOwner() {
        Dashboard dashboard = new Dashboard();
        dashboard.setUserId(999L);
        when(dashboardRepository.findById(1L)).thenReturn(Optional.of(dashboard));

        ResponseEntity<?> response = dashboardService.deleteDashboardById(testUser, 1L);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    void deleteDashboardById_shouldDelete_ifOwner() {
        Dashboard dashboard = new Dashboard();
        dashboard.setUserId(testUser.getId());
        when(dashboardRepository.findById(1L)).thenReturn(Optional.of(dashboard));

        ResponseEntity<?> response = dashboardService.deleteDashboardById(testUser, 1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(dashboardRepository).deleteById(1L);
    }

    @Test
    void saveWidgetsForDashboard_shouldReturnForbidden_ifNotOwner() {
        Dashboard dashboard = new Dashboard();
        dashboard.setUserId(999L);
        when(dashboardRepository.findById(1L)).thenReturn(Optional.of(dashboard));

        ResponseEntity<?> response = dashboardService.saveWidgetsForDashboard(testUser, 1L, new ArrayList<>());
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    void saveWidgetsForDashboard_shouldClearAndSave_ifOwner() {
        Dashboard dashboard = new Dashboard();
        dashboard.setUserId(testUser.getId());
        dashboard.setWidgets(new ArrayList<>());

        List<Widget> widgets = List.of(new Widget(), new Widget());

        when(dashboardRepository.findById(1L)).thenReturn(Optional.of(dashboard));
        when(dashboardRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        ResponseEntity<?> response = dashboardService.saveWidgetsForDashboard(testUser, 1L, widgets);
        Dashboard updated = (Dashboard) response.getBody();

        assertNotNull(updated);
        assertEquals(2, updated.getWidgets().size());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
