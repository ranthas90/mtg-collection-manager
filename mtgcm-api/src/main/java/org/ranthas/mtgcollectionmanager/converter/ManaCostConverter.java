package org.ranthas.mtgcollectionmanager.converter;

import org.ranthas.mtgcollectionmanager.dto.ManaCost;
import org.ranthas.mtgcollectionmanager.entity.MtgSymbol;
import org.ranthas.mtgcollectionmanager.repository.SymbolRepository;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class ManaCostConverter implements Converter<String, List<ManaCost>> {

    private final List<MtgSymbol> symbols;

    public ManaCostConverter(SymbolRepository symbolRepository) {
        this.symbols = symbolRepository.findAll();
    }

    @Override
    public List<ManaCost> convert(String manaCost) {
        return Arrays.stream(manaCost.split("}\\{"))
                .map(item -> {
                    String sanitized = item.replace("{", "").replace("}", "");
                    return symbols.stream()
                            .filter(symbol -> symbol.getSymbol().equals("{" + sanitized + "}"))
                            .map(symbol -> new ManaCost(symbol.getCode(), symbol.getImagePath()))
                            .toList();
                })
                .flatMap(List::stream)
                .toList();
    }
}
