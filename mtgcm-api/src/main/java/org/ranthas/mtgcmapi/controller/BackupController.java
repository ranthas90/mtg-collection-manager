package org.ranthas.mtgcmapi.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.ranthas.mtgcmapi.dto.LoadSetResponse;
import org.ranthas.mtgcmapi.service.BackupService;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@CrossOrigin(origins = "${origin.url}")
public class BackupController {

    private final BackupService backupService;

    public BackupController(BackupService backupService) {
        this.backupService = backupService;
    }

    @PostMapping(value = "/export-collection", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public StreamingResponseBody exportCollection(HttpServletResponse response) {

        String filename = "exported_collection_" +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + ".zip";

        response.setHeader("Content-Disposition", "attachment; filename=" + filename);
        response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
        response.setContentType("application/zip");
        // content-length?

        return outputStream -> {
            Resource resource = backupService.exportCollection();
            InputStream inputStream = resource.getInputStream();
            int length;
            byte[] buffer = new byte[1024];
            while ((length = inputStream.read(buffer)) >= 0) {
                outputStream.write(buffer, 0, length);
            }
        };
    }

    @PostMapping(value = "/import-collection")
    public List<LoadSetResponse> importCollection(@RequestParam(name = "file") MultipartFile collectionFile) {
        return backupService.importCollection(collectionFile);
    }
}
