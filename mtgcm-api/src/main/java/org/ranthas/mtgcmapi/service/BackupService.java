package org.ranthas.mtgcmapi.service;

import org.ranthas.mtgcmapi.dto.LoadSetResponse;
import org.ranthas.mtgcmapi.entity.MtgSet;
import org.ranthas.mtgcmapi.repository.MtgSetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

@Service
public class BackupService {

    private final MtgSetRepository mtgSetRepository;
    private final MtgMapper mtgMapper;

    private static final Logger LOGGER = LoggerFactory.getLogger(BackupService.class);

    public BackupService(MtgSetRepository mtgSetRepository, MtgMapper mtgMapper) {
        this.mtgSetRepository = mtgSetRepository;
        this.mtgMapper = mtgMapper;
    }

    /*
     * ****************************************************************************************************************
     * Exporta la base de datos a un fichero ZIP.
     * Cada colección se exporta a un fichero JSON de nombre "_<codigo del set>.json".
     * ¡Este formato de nombre se usará luego en la importación!
     * Si hay algún error en la exportación, no se generará ningún fichero y el proceso devuelve NULL.
     * Al terminar el proceso (con o sin error) se eliminan todos los ficheros temporales creados.
     */
    public ByteArrayResource exportCollection() {

        List<MtgSet> sets = mtgSetRepository.findAll();
        List<File> files = new ArrayList<>();
        LOGGER.info("Exporting {} sets", sets.size());

        for (MtgSet set : sets) {
            File file = mtgMapper.writeSet(set);
            files.add(file);
        }

        String target = "exported_collection_" +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + ".zip";

        try {
            FileOutputStream fileOutputStream = new FileOutputStream(target);
            ZipOutputStream zipOutputStream = new ZipOutputStream(fileOutputStream);

            for (File file : files) {
                LOGGER.info("   Exporting set {} file", file.getName());
                FileInputStream fileInputStream = new FileInputStream(file);
                ZipEntry zipEntry = new ZipEntry(file.getName());
                zipOutputStream.putNextEntry(zipEntry);

                byte[] bytes = new byte[1024];
                int length = 0;
                while ((length = fileInputStream.read(bytes)) >= 0) {
                    zipOutputStream.write(bytes, 0, length);
                }
                fileInputStream.close();
            }

            zipOutputStream.close();
            fileOutputStream.close();

            LOGGER.info("Exporting collection database success!");
            return new ByteArrayResource(Files.readAllBytes(Paths.get(target)));

        } catch (IOException e) {
            LOGGER.error("Error exporting database collection!", e);
            return null;
        } finally {
            LOGGER.info("Cleaning temporal files");
            File targetFile = new File(target);
            if (targetFile.exists()) targetFile.delete();
            files.forEach(File::delete);
        }

    }

    /*
     * ****************************************************************************************************************
     * Importa a la base de datos las colecciones que vengan dentro del fichero ZIP.
     * El fichero de importación debe ser un ZIP.
     * Dentro del fichero ZIP, deben haber tantos ficheros JSON como colecciones a importar.
     * Si hay algún fichero que no sea JSON, se omite.
     * Si hay algún fichero que no cumple el patrón de naming "_<código del set>.json", se omite.
     * Si es un fichero válido, se descomprime su contenido en un fichero temporal, se deserializa y se guarda en BBDD.
     * Cualquier error hace que el proceso ejecute un rollback en la base de datos, dejándola en su estado inicial.
     * Finalmente, se elimina el fichero temporal.
     */
    @Transactional
    public List<LoadSetResponse> importCollection(MultipartFile collectionFile) {

        List<LoadSetResponse> result = new ArrayList<>();

        if (!isZipFile(collectionFile)) {
            LOGGER.error("Imported collection file must be a ZIP file");
            return result;
        }

        try {
            byte[] buffer = new byte[1024];
            ZipInputStream zipInputStream = new ZipInputStream(collectionFile.getInputStream());
            ZipEntry zipEntry = zipInputStream.getNextEntry();

            while (zipEntry != null && isJsonEntry(zipEntry)) {
                String setCode = getSetCodeFromZipEntry(zipEntry);
                long startTime = System.currentTimeMillis();

                if (mtgSetRepository.findByCode(setCode).isEmpty()) {
                    File tempFile = new File("temp.json");
                    FileOutputStream fileOutputStream = new FileOutputStream(tempFile);
                    int length = 0;
                    while((length = zipInputStream.read(buffer)) > 0) {
                        fileOutputStream.write(buffer, 0, length);
                    }
                    fileOutputStream.close();

                    MtgSet set = mtgMapper.deserialize(tempFile);
                    mtgSetRepository.save(set);
                    result.add(LoadSetResponse.success(set.getCode(), startTime));
                } else {
                    result.add(LoadSetResponse.error(setCode, startTime));
                }

                zipEntry = zipInputStream.getNextEntry();
            }

        } catch (IOException e) {
            LOGGER.error("Error importing database collection file!", e);
            return result;
        } finally {
            LOGGER.info("Cleaning temporal files");
            new File("temp.json").delete();
        }

        return result;
    }

    private boolean isJsonEntry(ZipEntry zipEntry) {
        return zipEntry.getName().endsWith(".json");
    }

    private String getSetCodeFromZipEntry(ZipEntry zipEntry) {
        return zipEntry.getName().replace(".json", "").replace("_", "");
    }

    private boolean isZipFile(MultipartFile file) {
        return file.getOriginalFilename() != null && file.getOriginalFilename().endsWith(".zip");
    }
}
