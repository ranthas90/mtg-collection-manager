package org.ranthas.mtgcmapi.controller;

import org.ranthas.mtgcmapi.dto.LoadSetResponse;
import org.ranthas.mtgcmapi.service.BackupService;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "${origin.url}")
public class BackupController {

    private final BackupService backupService;

    public BackupController(BackupService backupService) {
        this.backupService = backupService;
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
