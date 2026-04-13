package org.ranthas.mtgcmapi.service;

import org.ranthas.mtgcmapi.converter.MtgCollectionConverter;
import org.ranthas.mtgcmapi.repository.MtgSetRepository;
import org.ranthas.mtgcmapi.dto.ScryfallSet;
import org.ranthas.mtgcmapi.entity.MtgSet;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MtgCollectionService {

    private final MtgSetRepository mtgSetRepository;
    private final ScryfallApiClient scryfallApiClient;
    private final MtgCollectionConverter mtgCollectionConverter;

    public MtgCollectionService(MtgSetRepository mtgSetRepository, ScryfallApiClient scryfallApiClient, MtgCollectionConverter mtgCollectionConverter) {
        this.mtgSetRepository = mtgSetRepository;
        this.scryfallApiClient = scryfallApiClient;
        this.mtgCollectionConverter = mtgCollectionConverter;
    }

    public List<MtgSet> findMissingSets() {
        List<String> allSets = scryfallApiClient.findAllSets().stream().map(ScryfallSet::getCode).toList();
        return mtgSetRepository.findMissingSets(allSets);
    }

    public void loadSets(List<String> setCodes) {
        for (String setCode : setCodes) {
            // descarga el set de scryfall y lo transforma en entity
            ScryfallSet scryfallSet = scryfallApiClient.findSetByCode(setCode);
            MtgSet mtgSet = mtgCollectionConverter.convert(scryfallSet);

            // descarga las cartas de scryfall y las transforma en entity + añadirlas a MtgSet
            // guarda el set + cartas en BBDD
            mtgSetRepository.save(mtgSet);
        }
    }
}
