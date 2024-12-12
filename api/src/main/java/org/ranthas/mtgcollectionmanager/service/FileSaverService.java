package org.ranthas.mtgcollectionmanager.service;

import org.ranthas.mtgcollectionmanager.dto.scryfall.ScryfallSymbol;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;

@Service
public class FileSaverService {

    public String saveSymbol(ScryfallSymbol symbol, byte[] image) throws IOException {

        String svgPath = symbol.getSvgPath();
        int index = svgPath.lastIndexOf("/") + 1;
        String imageName = svgPath.substring(index);
        String fileName = System.getenv("HOME") + "/Downloads/" + imageName;

        FileOutputStream fileOutputStream = new FileOutputStream(fileName);
        fileOutputStream.write(image);
        fileOutputStream.close();

        return imageName;
    }
}
