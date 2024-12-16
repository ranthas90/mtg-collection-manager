package org.ranthas.mtgcollectionmanager.service;

import org.ranthas.mtgcollectionmanager.dto.scryfall.ScryfallSet;
import org.ranthas.mtgcollectionmanager.dto.scryfall.ScryfallSymbol;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Service
public class FileSaverService {

    public String saveSymbol(ScryfallSymbol symbol, byte[] image) throws IOException {

        String svgPath = symbol.getSvgPath();
        int index = svgPath.lastIndexOf("/") + 1;
        String imageName = svgPath.substring(index);
        String folderName = System.getenv("MtgManagerPath") + "/symbols/";
        String fileName = folderName + imageName;

        createRootFolder(folderName);
        writeToDisk(fileName, image);

        return imageName;
    }

    public String saveSet(ScryfallSet set, byte[] image) throws IOException {

        String imageName = "_" + set.getCode() + ".svg";
        String folderName = System.getenv("MtgManagerPath") + "/sets/";
        String fileName = folderName + imageName;

        createRootFolder(folderName);
        writeToDisk(fileName, image);

        return imageName;
    }

    private void createRootFolder(String folderName) {
        new File(folderName).mkdirs();
    }

    private void writeToDisk(String fileName, byte[] image) throws IOException {
        FileOutputStream fileOutputStream = new FileOutputStream(fileName);
        fileOutputStream.write(image);
        fileOutputStream.close();
    }
}
