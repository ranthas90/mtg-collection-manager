package org.ranthas.mtgcollectionmanager.service;

import jakarta.transaction.Transactional;
import org.ranthas.mtgcollectionmanager.converter.ScryfallConverter;
import org.ranthas.mtgcollectionmanager.dto.DataLoadResponse;
import org.ranthas.mtgcollectionmanager.dto.ScryfallCard;
import org.ranthas.mtgcollectionmanager.dto.ScryfallSet;
import org.ranthas.mtgcollectionmanager.dto.ScryfallSymbol;
import org.ranthas.mtgcollectionmanager.entity.MtgCard;
import org.ranthas.mtgcollectionmanager.entity.MtgSet;
import org.ranthas.mtgcollectionmanager.entity.MtgSymbol;
import org.ranthas.mtgcollectionmanager.repository.CardRepository;
import org.ranthas.mtgcollectionmanager.repository.SetRepository;
import org.ranthas.mtgcollectionmanager.repository.SymbolRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DataLoaderService {

    private final ScryfallClient scryfallClient;
    private final ScryfallConverter scryfallConverter;
    private final SymbolRepository symbolRepository;
    private final SetRepository setRepository;
    private final CardRepository cardRepository;


    public DataLoaderService(
            ScryfallClient scryfallClient,
            ScryfallConverter scryfallConverter,
            SymbolRepository symbolRepository,
            SetRepository setRepository,
            CardRepository cardRepository
    ) {
        this.scryfallClient = scryfallClient;
        this.scryfallConverter = scryfallConverter;
        this.symbolRepository = symbolRepository;
        this.setRepository = setRepository;
        this.cardRepository = cardRepository;
    }

    @Transactional
    public DataLoadResponse loadSymbols() {

        long start = System.currentTimeMillis();
        symbolRepository.deleteAll();
        List<ScryfallSymbol> scryfallSymbols = scryfallClient.fetchSymbols();

        for (ScryfallSymbol scryfallSymbol : scryfallSymbols) {
            MtgSymbol mtgSymbol = scryfallConverter.convert(scryfallSymbol);
            symbolRepository.save(mtgSymbol);
        }

        return new DataLoadResponse(scryfallSymbols.size(), (System.currentTimeMillis() - start));
    }

    @Transactional
    public DataLoadResponse loadSets() {
        // TODO: pendiente de hacer
        return null;
    }

    @Transactional
    public DataLoadResponse loadSet(String code) {

        long start = System.currentTimeMillis();
        ScryfallSet set = scryfallClient.fetchSetByCode(code);

        if (set.isValid()) {

            cardRepository.deleteBySetCode(code);
            setRepository.deleteByCode(code);

            List<ScryfallCard> cards = scryfallClient.fetchSetCards(code);

            MtgSet mtgSet = scryfallConverter.convert(set);
            MtgSet savedMtgSet = setRepository.save(mtgSet);
            long collectionOrder = 0;

            for (ScryfallCard card : cards) {
                MtgCard mtgCard = scryfallConverter.convert(card);
                mtgCard.setMtgSet(savedMtgSet);
                mtgCard.setNumericCollectorNumber(collectionOrder);

                cardRepository.save(mtgCard);
                collectionOrder++;
            }

            return new DataLoadResponse(cards.size() + 1, (System.currentTimeMillis() - start));
        }

        return new DataLoadResponse(0, (System.currentTimeMillis() - start));
    }


}
