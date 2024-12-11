package org.ranthas.mtgcollectionmanager.controller;

import org.ranthas.mtgcollectionmanager.service.MaintenanceService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping("/maintenance/init")
    public void initializeDatabase() {
        maintenanceService.clearDatabase();
        maintenanceService.importScryfallSymbols();
        maintenanceService.importScryfallSets();
        maintenanceService.importScryfallCards();
    }
}
