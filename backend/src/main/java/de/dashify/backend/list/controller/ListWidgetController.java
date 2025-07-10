package de.dashify.backend.list.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboards/{dashboardId}/widgets/list")
public class ListWidgetController {

    @GetMapping
    public ResponseEntity<?> getListWidget(
        @PathVariable Long dashboardId,
        @RequestParam String type,
        @RequestParam String size
    ) {
        return ResponseEntity.ok().build();
    }
}
