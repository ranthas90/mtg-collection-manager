package org.ranthas.mtgcollectionmanager.converter;

import org.ranthas.mtgcollectionmanager.entity.Symbol;
import org.ranthas.mtgcollectionmanager.repository.SymbolRepository;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class SymbolConverter implements Converter<String, List<String>> {

    private final SymbolRepository symbolRepository;

    private static final String REGEXP = "}\\{";
    private static final String REPLACE_REGEXP = "};\\{";

    public SymbolConverter(SymbolRepository symbolRepository) {
        this.symbolRepository = symbolRepository;
    }

    @Override
    public List<String> convert(String source) {

        if (source == null || source.equals("")) {
            return null;
        }

        source = source.replace(" // ", "");
        source = source.replaceAll(REGEXP, REPLACE_REGEXP);
        String[] symbolsCodes = source.split(";");
        List<String> symbolsUrls = new ArrayList<>();

        for (String symbolCode : symbolsCodes) {
            Symbol symbol = symbolRepository.findByCode(symbolCode);
            symbolsUrls.add(symbol.getImagePath());
        }

        return symbolsUrls;
    }
    
}
