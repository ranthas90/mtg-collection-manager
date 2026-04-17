package org.ranthas.mtgcmapi.service;

import org.ranthas.mtgcmapi.converter.ScryfallConverter;
import org.ranthas.mtgcmapi.dto.LoadSetResponse;
import org.ranthas.mtgcmapi.dto.ScryfallCard;
import org.ranthas.mtgcmapi.dto.ScryfallSet;
import org.ranthas.mtgcmapi.dto.UpdateSetCard;
import org.ranthas.mtgcmapi.entity.MtgCard;
import org.ranthas.mtgcmapi.entity.MtgSet;
import org.ranthas.mtgcmapi.repository.MtgCardRepository;
import org.ranthas.mtgcmapi.repository.MtgSetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class MtgCollectionService {

    private final MtgSetRepository mtgSetRepository;
    private final MtgCardRepository mtgCardRepository;
    private final ScryfallApiClient scryfallApiClient;
    private final ScryfallConverter scryfallConverter;

    private static final Logger LOGGER = LoggerFactory.getLogger(MtgCollectionService.class);

    public MtgCollectionService(MtgSetRepository mtgSetRepository, MtgCardRepository mtgCardRepository,
                                ScryfallApiClient scryfallApiClient, ScryfallConverter scryfallConverter) {
        this.mtgSetRepository = mtgSetRepository;
        this.mtgCardRepository = mtgCardRepository;
        this.scryfallApiClient = scryfallApiClient;
        this.scryfallConverter = scryfallConverter;
    }

    public List<MtgSet> findMissingSets() {
        List<ScryfallSet> scryfallSets = scryfallApiClient.findAllSets();
        List<String> databaseSets = mtgSetRepository.findAll().stream().map(MtgSet::getCode).toList();
        List<MtgSet> result = new ArrayList<>();

        for (ScryfallSet scryfallSet : scryfallSets) {
            if (!databaseSets.contains(scryfallSet.getCode())) {
                result.add(scryfallConverter.convert(scryfallSet));
            }
        }

        return result;
    }

    public List<LoadSetResponse> loadSets(List<String> setCodes) {

        // TODO: si hay algún error debemos capturarlo, procesarlo como error y añadirlo al vector de respuesta
        // TODO: no podemos dejar que el error se propague por el ControllerAdvice
        List<LoadSetResponse> response = new ArrayList<>();

        for (String setCode : setCodes) {

            long start = System.currentTimeMillis();
            LOGGER.info("Loading {} from Scryfall", setCode);
            ScryfallSet scryfallSet = scryfallApiClient.findSetByCode(setCode);

            if (scryfallSet == null) {
                response.add(LoadSetResponse.error(setCode, start));

            } else {
                MtgSet mtgSet = scryfallConverter.convert(scryfallSet);

                List<ScryfallCard> scryfallCards = scryfallApiClient.findSetCards(setCode);
                for (int i = 0; i < scryfallCards.size(); i++) {
                    ScryfallCard scryfallCard = scryfallCards.get(i);
                    MtgCard card = scryfallConverter.convert(scryfallCard);
                    card.setSortNumber(i);
                    card.setCollected(false);
                    mtgSet.addCard(card);
                }

                mtgSetRepository.save(mtgSet);
                response.add(LoadSetResponse.success(setCode, start));
            }
        }

        return response;
    }

    public List<MtgSet> findAllSets() {
        return mtgSetRepository.findAll();
    }

    public List<MtgCard> findAllSetCards(String setCode) {
        return mtgCardRepository.findAllBySetCode(setCode);
    }

    public MtgCard updateSetCard(UUID cardId, UpdateSetCard request) {
        MtgCard mtgCard = mtgCardRepository.getReferenceById(cardId);
        mtgCard.setCollected(request.collected());

        return mtgCardRepository.save(mtgCard);
    }
}
