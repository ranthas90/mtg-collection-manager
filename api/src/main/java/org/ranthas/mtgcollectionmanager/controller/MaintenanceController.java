package org.ranthas.mtgcollectionmanager.controller;

import org.ranthas.mtgcollectionmanager.service.MaintenanceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@CrossOrigin(origins = "*")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    private static final Logger LOGGER = LoggerFactory.getLogger(MaintenanceController.class);

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping("/maintenance/init")
    public void initializeDatabase() throws IOException {

        LOGGER.info("Database initialization process begins");
        long startTime = System.currentTimeMillis();

        maintenanceService.clearDatabase();
        maintenanceService.importScryfallSymbols();
        maintenanceService.importScryfallSets();
        maintenanceService.importScryfallCards();

        long elapsedTime = System.currentTimeMillis() - startTime;
        LOGGER.info("Database initialization process finished in {} ms", elapsedTime);
    }
}
