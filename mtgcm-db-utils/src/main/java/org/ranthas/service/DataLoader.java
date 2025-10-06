package org.ranthas.service;

import com.opencsv.CSVWriter;
import org.ranthas.jdbc.Database;
import org.ranthas.model.ScryfallCard;
import org.ranthas.model.ScryfallSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class DataLoader {

    private final Database database = Database.getInstance();
    private final ScryfallClient scryfallClient = new ScryfallClient();

    private static final Logger LOGGER = LoggerFactory.getLogger(DataLoader.class);

    public void createNewDatabase() {
        try {

            database.createMtgSymbols();
            database.createMtgSets();
            database.createMtgCards();

            scryfallClient.fetchSymbols().forEach(scryfallSymbol -> {
                LOGGER.info("Writing symbol {}", scryfallSymbol.getCode());
                database.writeSymbol(
                        scryfallSymbol.getCode(),
                        scryfallSymbol.getSymbol(),
                        scryfallSymbol.getSvgPath()
                );
            });

            List<ScryfallSet> scryfallSets = scryfallClient.fetchSets().stream().filter(ScryfallSet::isValid).toList();

            for (int i = 0; i < scryfallSets.size(); i++) {
                ScryfallSet scryfallSet = scryfallSets.get(i);
                LOGGER.info("Writing set {}", scryfallSet.getCode());
                database.writeSet(
                        scryfallSet.getId().toString(),
                        scryfallSet.getCode(),
                        scryfallSet.getName(),
                        scryfallSet.getReleasedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
                        scryfallSet.getCardCount(),
                        scryfallSet.getIconPath(),
                        scryfallSet.getSetType()
                );

                List<ScryfallCard> scryfallCards = scryfallClient.fetchSetCards(scryfallSet.getCode());
                for (int j = 0; j < scryfallCards.size(); j++) {
                    ScryfallCard scryfallCard = scryfallCards.get(j);
                    LOGGER.info("(Set {}/{} Card {}/{}) Writing card {}::{}", i+1, scryfallSets.size(), j+1, scryfallCards.size(), scryfallSet.getCode(), scryfallCard.getName());
                    database.writeCard(
                            scryfallCard.getId().toString(),
                            scryfallSet.getCode(),
                            scryfallCard.getCardmarketId(),
                            scryfallCard.getManaCost(),
                            scryfallCard.getName(),
                            scryfallCard.getTypeLine(),
                            scryfallCard.getCollectorNumber(),
                            j,
                            scryfallCard.getRarity(),
                            scryfallCard.getNormalPrice(),
                            scryfallCard.getFoilPrice(),
                            false
                    );
                }
            }
        } catch (Exception e) {
            LOGGER.error("Error loading data into mtgcm-db", e);
        } finally {
            database.close();
        }
    }

    public void createSetCardsCsv(String setCode) {

        LOGGER.info("Fetching set {} cards", setCode);
        List<ScryfallCard> scryfallCards = scryfallClient.fetchSetCards(setCode);

        LOGGER.info("Building CSV file");
        File setCardsCsv = new File(setCode + "_cards.csv");
        try {
            FileWriter fileWriter = new FileWriter(setCardsCsv);
            CSVWriter csvWriter = new CSVWriter(fileWriter);

            String[] header = {
                    "id","set_code","cardmarket_id","mana_cost","name","type_line","collector_number","order_number",
                    "rarity","normal_price","foil_price","is_owned"
            };
            csvWriter.writeNext(header);

            for (int i = 0; i < scryfallCards.size(); i++) {
                ScryfallCard scryfallCard = scryfallCards.get(i);
                String[] row = {
                        scryfallCard.getId().toString(),
                        setCode,
                        scryfallCard.getCardmarketId().toString(),
                        scryfallCard.getManaCost(),
                        scryfallCard.getName(),
                        scryfallCard.getName(),
                        scryfallCard.getTypeLine(),
                        scryfallCard.getCollectorNumber(),
                        Integer.toString(i),
                        scryfallCard.getRarity(),
                        Double.toString(scryfallCard.getNormalPrice()),
                        Double.toString(scryfallCard.getFoilPrice()),
                        "false"
                };
                csvWriter.writeNext(row);
            }

            LOGGER.info("Set {} cards successfully exported to CSV", setCode);
            csvWriter.close();

        } catch (IOException e) {
            LOGGER.error("Error writing set {} cards to file {}", setCode, setCardsCsv.getName());
        }
    }
}
