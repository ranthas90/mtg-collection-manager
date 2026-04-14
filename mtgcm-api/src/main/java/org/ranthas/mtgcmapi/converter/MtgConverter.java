package org.ranthas.mtgcmapi.converter;

import org.ranthas.mtgcmapi.dto.SetDto;
import org.ranthas.mtgcmapi.entity.MtgSet;
import org.springframework.stereotype.Component;

@Component
public class MtgConverter {

    public SetDto convert(MtgSet mtgSet) {
        return new SetDto(mtgSet.getCode(), mtgSet.getName(), mtgSet.getType(), mtgSet.getReleaseDate(), mtgSet.getTotalCards());
    }
}
