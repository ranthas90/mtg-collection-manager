package org.ranthas.mtgcmapi.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "mtg_sets")
public class MtgSet {

    @Id
    private UUID id;

    private String code;
    private String name;
    private String type;

    @Column(name = "release_date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate releaseDate;

    @Column(name = "total_cards")
    private Long totalCards;

    @Column(name = "icon_uri")
    private String iconUri;

    @OneToMany(mappedBy = "mtgSet", cascade = CascadeType.ALL)
    private List<MtgCard> cards = new ArrayList<>();

    public MtgSet() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public Long getTotalCards() {
        return totalCards;
    }

    public void setTotalCards(Long totalCards) {
        this.totalCards = totalCards;
    }

    public String getIconUri() {
        return iconUri;
    }

    public void setIconUri(String iconUri) {
        this.iconUri = iconUri;
    }

    public List<MtgCard> getCards() {
        return cards;
    }

    public void setCards(List<MtgCard> cards) {
        this.cards = cards;
    }

    public void addCard(MtgCard card) {
        this.cards.add(card);
        card.setMtgSet(this);
    }

    public Long getCollectedCards() {
        return cards.stream().filter(MtgCard::isCollected).count();
    }

    @Override
    public String toString() {
        return "MtgSet{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", releaseDate=" + releaseDate +
                ", totalCards=" + totalCards +
                ", iconUri='" + iconUri + '\'' +
                '}';
    }
}
