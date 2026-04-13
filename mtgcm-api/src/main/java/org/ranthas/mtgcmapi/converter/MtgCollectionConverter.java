package org.ranthas.mtgcmapi.converter;

import org.ranthas.mtgcmapi.dto.ScryfallSet;
import org.ranthas.mtgcmapi.entity.MtgSet;

public class MtgCollectionConverter {

    public MtgSet convert(ScryfallSet scryfallSet) {

        MtgSet mtgSet = new MtgSet();

        mtgSet.setId(scryfallSet.getCode());
        mtgSet.setName(scryfallSet.getName());
        mtgSet.setType(scryfallSet.getSetType());
        mtgSet.setReleaseDate(scryfallSet.getReleasedAt());
        mtgSet.setTotalCards(scryfallSet.getCardCount());
        mtgSet.setIconUri(scryfallSet.getIconSvgUri());

        return mtgSet;
    }
}
