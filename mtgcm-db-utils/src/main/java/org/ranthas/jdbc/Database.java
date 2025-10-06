package org.ranthas.jdbc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class Database {

    private static Database instance;
    private Connection connection = null;
    private static final Logger LOGGER = LoggerFactory.getLogger(Database.class);

    private Database() {
        try {
            deleteDatabaseFile();
            connection = DriverManager.getConnection("jdbc:sqlite:mtgcm.db");
        } catch (SQLException e) {
            LOGGER.error("Error while trying to connect to inner SQLite database");
            LOGGER.error("Stacktrace: ", e);
        }
    }

    private void deleteDatabaseFile() {
        File databaseFile = new File("mtgcm.db");
        if (databaseFile.exists()) {
            databaseFile.delete();
        }
    }

    public static Database getInstance() {
        if (instance == null) {
            synchronized (Database.class) {
                if (instance == null) {
                    instance = new Database();
                }
            }
        }
        return instance;
    }

    public void createMtgSymbols() {

        String sql = """
                create table if not exists mtg_symbols (
                code text primary key,
                symbol text not null,
                image text not null
                );
                """;

        LOGGER.info("Creating table mtg_symbols");
        try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            LOGGER.error("Error creating table mtg_symbols at bootstrap");
            LOGGER.error("Stacktrace: ", e);
        }
    }

    public void createMtgSets() {

        String sql = """
                create table if not exists mtg_sets (
                id text primary key,
                code text not null,
                name text not null,
                release_date text not null,
                total_cards integer not null,
                icon_path text not null,
                set_type text not null
                );
                """;

        LOGGER.info("Creating table mtg_sets");
        try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            LOGGER.error("Error creating table mtg_sets at bootstrap");
            LOGGER.error("Stacktrace: ", e);
        }
    }

    public void createMtgCards() {

        String sql = """
                create table if not exists mtg_cards (
                id text primary key,
                set_code text not null,
                cardmarket_id integer,
                mana_cost text,
                name text not null,
                type_line text,
                collector_number text,
                order_number integer not null,
                rarity text not null,
                normal_price real,
                foil_price real,
                is_owned integer not null
                );
                """;

        LOGGER.info("Creating table mtg_cards");
        try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            LOGGER.error("Error creating table mtg_cards at bootstrap");
            LOGGER.error("Stacktrace: ", e);
        }
    }

    public void writeSymbol(String code, String symbol, String image) {

        String sql = """
                insert into mtg_symbols (code,symbol,image)
                values
                (?,?,?)
                """;

        try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.setString(1, code);
            preparedStatement.setString(2, symbol);
            preparedStatement.setString(3, image);

            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            LOGGER.error("Error writing new symbol with SQL: {}", sql);
            LOGGER.error("Parameter #1: {}", code);
            LOGGER.error("Parameter #2: {}", symbol);
            LOGGER.error("Parameter #3: {}", image);
            LOGGER.error("Stacktrace: ", e);
            throw new RuntimeException(e);
        }
    }

    public void writeSet(String id, String code, String name, String releaseDate, Integer totalCards, String iconPath, String setType) {

        String sql = """
                insert into mtg_sets (id,code,name,release_date,total_cards,icon_path,set_type)
                values
                (?,?,?,?,?,?,?)
                """;

        try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.setString(1, id);
            preparedStatement.setString(2, code);
            preparedStatement.setString(3, name);
            preparedStatement.setString(4, releaseDate);
            preparedStatement.setInt(5, totalCards);
            preparedStatement.setString(6, iconPath);
            preparedStatement.setString(7, setType);

            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            LOGGER.error("Error writing new symbol with SQL: {}", sql);
            LOGGER.error("Parameter #1: {}", id);
            LOGGER.error("Parameter #2: {}", code);
            LOGGER.error("Parameter #3: {}", name);
            LOGGER.error("Parameter #4: {}", releaseDate);
            LOGGER.error("Parameter #5: {}", totalCards);
            LOGGER.error("Parameter #6: {}", iconPath);
            LOGGER.error("Parameter #7: {}", setType);
            LOGGER.error("Stacktrace: ", e);
            throw new RuntimeException(e);
        }
    }

    public void writeCard(String id, String setCode, Integer cardmarketId, String manaCost, String name, String typeLine, String collectorNumber, int orderNumber, String rarity, Double normalPrice, Double foilPrice, boolean isOwned) {

        String sql = """
                insert into mtg_cards (id,set_code,cardmarket_id,mana_cost,name,type_line,collector_number,order_number,rarity,normal_price,foil_price,is_owned)
                values
                (?,?,?,?,?,?,?,?,?,?,?,?)
                """;

        try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.setString(1, id);
            preparedStatement.setString(2, setCode);
            preparedStatement.setInt(3, cardmarketId);
            preparedStatement.setString(4, manaCost);
            preparedStatement.setString(5, name);
            preparedStatement.setString(6, typeLine);
            preparedStatement.setString(7, collectorNumber);
            preparedStatement.setInt(8, orderNumber);
            preparedStatement.setString(9, rarity);
            preparedStatement.setDouble(10, normalPrice);
            preparedStatement.setDouble(11, foilPrice);
            preparedStatement.setBoolean(12, isOwned);

            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            LOGGER.error("Error writing new card with SQL: {}", sql);
            LOGGER.error("Parameter #1: {}", id);
            LOGGER.error("Parameter #2: {}", setCode);
            LOGGER.error("Parameter #2: {}", cardmarketId);
            LOGGER.error("Parameter #3: {}", manaCost);
            LOGGER.error("Parameter #4: {}", name);
            LOGGER.error("Parameter #5: {}", typeLine);
            LOGGER.error("Parameter #6: {}", collectorNumber);
            LOGGER.error("Parameter #7: {}", orderNumber);
            LOGGER.error("Parameter #8: {}", rarity);
            LOGGER.error("Parameter #9: {}", normalPrice);
            LOGGER.error("Parameter #10: {}", foilPrice);
            LOGGER.error("Parameter #11: {}", isOwned);
            LOGGER.error("Stacktrace: ", e);
            throw new RuntimeException(e);
        }
    }

    public void close() {
        try {
            if (connection != null) {
                connection.close();
            }
        } catch (SQLException e) {
            LOGGER.error("Error while trying to close SQLite database");
            LOGGER.error("Stacktrace: ", e);
        }
    }
}
