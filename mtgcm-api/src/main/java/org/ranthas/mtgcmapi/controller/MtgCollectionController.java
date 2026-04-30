package org.ranthas.mtgcmapi.controller;

import org.ranthas.mtgcmapi.converter.MtgConverter;
import org.ranthas.mtgcmapi.dto.CardDto;
import org.ranthas.mtgcmapi.dto.LoadSetResponse;
import org.ranthas.mtgcmapi.dto.SetDto;
import org.ranthas.mtgcmapi.dto.UpdateSetCard;
import org.ranthas.mtgcmapi.service.BackupService;
import org.ranthas.mtgcmapi.service.MtgCollectionService;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class MtgCollectionController {

    private final MtgCollectionService mtgCollectionService;
    private final MtgConverter mtgConverter;
    private final BackupService backupService;

    public MtgCollectionController(MtgCollectionService mtgCollectionService, MtgConverter mtgConverter, BackupService backupService) {
        this.mtgCollectionService = mtgCollectionService;
        this.mtgConverter = mtgConverter;
        this.backupService = backupService;
    }

    @GetMapping("/missing-sets")
    public List<SetDto> findMissingSets() {
        return mtgCollectionService.findMissingSets().stream().map(mtgConverter::convert).toList();
    }

    @PostMapping("/load-collections")
    public List<LoadSetResponse> loadCollectionSets(@RequestBody List<String> setCodes) {
        // TODO: chequear si ya existe; aunque el front pide los sets que faltan, pueden entrar manualmente
        return mtgCollectionService.loadSets(setCodes);
    }

    @GetMapping("/sets")
    public List<SetDto> findSets() {
        return mtgCollectionService.findAllSets().stream().map(mtgConverter::convert).toList();
    }

    @GetMapping("/sets/{code}/cards")
    public List<CardDto> findSetCards(@PathVariable String code) {
        return mtgCollectionService.findAllSetCards(code).stream().map(mtgConverter::convert).toList();
    }

    @PutMapping("/sets/{code}/cards/{id}")
    public CardDto updateSetCard(@RequestBody UpdateSetCard request, @PathVariable UUID id) {
        // TODO: De momento sólo actualiza el campo "collected"
        return mtgConverter.convert(mtgCollectionService.updateSetCard(id, request));
    }

    @PostMapping(value = "/export-collection", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public Resource exportCollection() {
        return backupService.exportCollection();
    }

    @PostMapping(value = "/import-collection")
    public List<LoadSetResponse> importCollection(@RequestParam(name = "file") MultipartFile collectionFile) {
        return backupService.importCollection(collectionFile);
    }
}
