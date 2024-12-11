package org.ranthas.mtgcollectionmanager.service;

import org.ranthas.mtgcollectionmanager.converter.ScryfallConverter;
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

import java.util.List;

@Service
public class MaintenanceService {

    private final SymbolRepository symbolRepository;
    private final SetRepository setRepository;
    private final CardRepository cardRepository;
    private final ScryfallConverter scryfallConverter;
    private final ScryfallProvider scryfallProvider;

    private static final Logger LOGGER = LoggerFactory.getLogger(MaintenanceService.class);

    public MaintenanceService(
            SymbolRepository symbolRepository,
            SetRepository setRepository,
            CardRepository cardRepository,
            ScryfallConverter scryfallConverter,
            ScryfallProvider scryfallProvider) {
        this.symbolRepository = symbolRepository;
        this.setRepository = setRepository;
        this.cardRepository = cardRepository;
        this.scryfallConverter = scryfallConverter;
        this.scryfallProvider = scryfallProvider;
    }

    @Transactional
    public void clearDatabase() {
        symbolRepository.deleteAll();
        cardRepository.deleteAll();
        setRepository.deleteAll();
    }

    @Transactional
    public void importScryfallSymbols() {

        LOGGER.info("Fetching symbols from Scryfall API...");
        List<ScryfallSymbol> scryfallSymbols = scryfallProvider.fetchSymbols();

        for (ScryfallSymbol scryfallSymbol : scryfallSymbols) {
            LOGGER.info("Saving symbol {}", scryfallSymbol.getSymbol());
            Symbol symbol = new Symbol(scryfallSymbol);
            symbolRepository.save(symbol);
        }
        LOGGER.info("Imported {} symbols into the database", scryfallSymbols.size());
    }

    public void importScryfallSets() {

        LOGGER.info("Fetching sets from Scryfall API...");
        List<ScryfallSet> scryfallSets = scryfallProvider
                .fetchSets()
                .stream()
                .filter(ScryfallSet::isValid)
                .toList();

        for (ScryfallSet scryfallSet : scryfallSets) {
            LOGGER.info("Saving set [{}] :: {}", scryfallSet.getCode(), scryfallSet.getName());
            Set set = new Set(scryfallSet);
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

                Card card = scryfallConverter.convert(scryfallCard);
                card.setMtgSet(set);
                card.setNumericCollectorNumber(cardIndex);

                LOGGER.info("Saving card {}", card.getName());
                cardRepository.save(card);
                cardIndex = cardIndex + 1;
            }
        }
    }
}
