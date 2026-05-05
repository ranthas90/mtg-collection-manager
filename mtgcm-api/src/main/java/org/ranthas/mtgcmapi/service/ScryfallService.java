package org.ranthas.mtgcmapi.service;

import org.ranthas.mtgcmapi.converter.ScryfallConverter;
import org.ranthas.mtgcmapi.dto.LoadSetResponse;
import org.ranthas.mtgcmapi.dto.ScryfallCard;
import org.ranthas.mtgcmapi.dto.ScryfallSet;
import org.ranthas.mtgcmapi.entity.MtgCard;
import org.ranthas.mtgcmapi.entity.MtgSet;
import org.ranthas.mtgcmapi.repository.MtgSetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ScryfallService {

    private final ScryfallApiClient scryfallApiClient;
    private final ScryfallConverter scryfallConverter;
    private final MtgSetRepository mtgSetRepository;

    private static final Logger LOGGER = LoggerFactory.getLogger(ScryfallService.class);

    public ScryfallService(ScryfallApiClient scryfallApiClient, ScryfallConverter scryfallConverter,
                           MtgSetRepository mtgSetRepository) {
        this.scryfallApiClient = scryfallApiClient;
        this.scryfallConverter = scryfallConverter;
        this.mtgSetRepository = mtgSetRepository;
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

        List<LoadSetResponse> response = new ArrayList<>();

        for (String setCode : setCodes) {

            long start = System.currentTimeMillis();
            if (mtgSetRepository.findByCode(setCode).isPresent()) {
                response.add(LoadSetResponse.error(setCode, start));
            } else {
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
        }

        return response;
    }
}
