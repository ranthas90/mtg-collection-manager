package org.ranthas.mtgcollectionmanager.controller;

import org.ranthas.mtgcollectionmanager.dto.DataLoadResponse;
import org.ranthas.mtgcollectionmanager.service.DataLoaderService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class DataLoaderController {

    private final DataLoaderService dataLoaderService;

    public DataLoaderController(DataLoaderService dataLoaderService) {
        this.dataLoaderService = dataLoaderService;
    }

    @GetMapping("/data-loader/symbols")
    public DataLoadResponse loadSymbols() {
        return dataLoaderService.loadSymbols();
    }

    @GetMapping("/data-loader/sets")
    public DataLoadResponse loadSets() {
        return dataLoaderService.loadSets();
    }

    @GetMapping("/data-loader/sets/{code}")
    public DataLoadResponse loadSet(@PathVariable String code) {
        return dataLoaderService.loadSet(code);
    }
}
