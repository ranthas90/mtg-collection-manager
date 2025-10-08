package org.ranthas.mtgcollectionmanager.controller;

import org.ranthas.mtgcollectionmanager.dto.CardDTO;
import org.ranthas.mtgcollectionmanager.dto.SetDTO;
import org.ranthas.mtgcollectionmanager.service.CollectionService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class CollectionController {

    private final CollectionService collectionService;

    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @GetMapping("/collection/sets")
    public List<SetDTO> findAllSets() {
        return collectionService.findAllSets();
    }

    @GetMapping("/collection/sets/{code}")
    public SetDTO findSetByCode(@PathVariable String code) {
        return collectionService.findSetByCode(code);
    }

    @GetMapping("/collection/sets/{code}/cards")
    public List<CardDTO> findCardsBySetCode(@PathVariable String code) {
        return collectionService.findSetCardsByCode(code);
    }
}
