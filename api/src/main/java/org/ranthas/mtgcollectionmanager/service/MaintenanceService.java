package org.ranthas.mtgcollectionmanager.service;

import org.ranthas.mtgcollectionmanager.converter.SymbolConverter;
import org.ranthas.mtgcollectionmanager.dto.scryfall.ScryfallCard;
import org.ranthas.mtgcollectionmanager.dto.scryfall.ScryfallSet;
import org.ranthas.mtgcollectionmanager.dto.scryfall.ScryfallSymbol;
import org.ranthas.mtgcollectionmanager.entity.Card;
import org.ranthas.mtgcollectionmanager.entity.Set;
import org.ranthas.mtgcollectionmanager.entity.Symbol;
import org.ranthas.mtgcollectionmanager.repository.CardRepository;
import org.ranthas.mtgcollectionmanager.repository.SetRepository;
import org.ranthas.mtgcollectionmanager.repository.SymbolRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaintenanceService {

    private final SymbolRepository symbolRepository;
    private final SetRepository setRepository;
    private final CardRepository cardRepository;
    private final ScryfallProvider scryfallProvider;
    private final FileSaverService fileSaverService;
    private final SymbolConverter symbolConverter;

    private static final Logger LOGGER = LoggerFactory.getLogger(MaintenanceService.class);

    public MaintenanceService(
            SymbolRepository symbolRepository,
            SetRepository setRepository,
            CardRepository cardRepository,
            ScryfallProvider scryfallProvider,
            FileSaverService fileSaverService,
            SymbolConverter symbolConverter
    ) {
        this.symbolRepository = symbolRepository;
        this.setRepository = setRepository;
        this.cardRepository = cardRepository;
        this.scryfallProvider = scryfallProvider;
        this.fileSaverService = fileSaverService;
        this.symbolConverter = symbolConverter;
    }

    @Transactional
    public void clearDatabase() {
        symbolRepository.deleteAll();
        cardRepository.deleteAll();
        setRepository.deleteAll();
    }

    @Transactional
    public void importScryfallSymbols() throws IOException {

        LOGGER.info("Fetching symbols from Scryfall API...");
        List<ScryfallSymbol> scryfallSymbols = scryfallProvider.fetchSymbols();

        for (ScryfallSymbol scryfallSymbol : scryfallSymbols) {
            String symbolCode = scryfallSymbol.getSymbol();
            LOGGER.info("Saving symbol {} image into disk", symbolCode);

            byte[] bytes = scryfallProvider.downloadImage(scryfallSymbol.getSvgPath());
            String symbolPath = fileSaverService.saveSymbol(scryfallSymbol, bytes);

            LOGGER.info("Saving symbol {} into database", symbolCode);
            Symbol symbol = new Symbol(symbolCode, symbolPath);
            symbolRepository.save(symbol);
        }
        LOGGER.info("Imported {} symbols into the database", scryfallSymbols.size());
    }

    public void importScryfallSets() throws IOException {

        LOGGER.info("Fetching sets from Scryfall API...");
        List<ScryfallSet> scryfallSets = scryfallProvider
                .fetchSets()
                .stream()
                .filter(ScryfallSet::isValid)
                .toList();

        for (ScryfallSet scryfallSet : scryfallSets) {
            LOGGER.info("Saving set [{}] :: {} into disk", scryfallSet.getCode(), scryfallSet.getName());

            byte[] bytes = scryfallProvider.downloadImage(scryfallSet.getIconPath());
            String setPath = fileSaverService.saveSet(scryfallSet, bytes);

            LOGGER.info("Saving set [{}] :: {} into database", scryfallSet.getCode(), scryfallSet.getName());
            Set set = new Set(scryfallSet, setPath);
            setRepository.save(set);
        }
        LOGGER.info("Imported {} sets into the database", scryfallSets.size());
    }

    public void importScryfallCards() {

        LOGGER.info("Fetching current database sets...");
        List<Set> sets = setRepository.findAll();

        for (Set set : sets) {

            LOGGER.info("Fetching cards from set {}...", set.getName());
            List<ScryfallCard> scryfallCards = scryfallProvider.fetchSetCards(set.getCode());
            long cardIndex = 0L;

            for (ScryfallCard scryfallCard : scryfallCards) {

                String manaCost = String.join(";", symbolConverter.convert(scryfallCard.getManaCost()));
                Card card = new Card(scryfallCard, set, cardIndex, manaCost);
                card.setMtgSet(set);
                card.setNumericCollectorNumber(cardIndex);

                LOGGER.info("Saving card {}", card.getName());
                cardRepository.save(card);
                cardIndex = cardIndex + 1;
            }
        }
    }
}
