package org.ranthas.mtgcmapi.controller;

import org.ranthas.mtgcmapi.converter.MtgConverter;
import org.ranthas.mtgcmapi.dto.SetDto;
import org.ranthas.mtgcmapi.entity.MtgSet;
import org.ranthas.mtgcmapi.service.MtgCollectionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MtgCollectionController {

    private final MtgCollectionService mtgCollectionService;
    private final MtgConverter mtgConverter;

    public MtgCollectionController(MtgCollectionService mtgCollectionService, MtgConverter mtgConverter) {
        this.mtgCollectionService = mtgCollectionService;
        this.mtgConverter = mtgConverter;
    }

    @GetMapping("/missing-sets")
    public List<SetDto> findMissingSets() {
        return mtgCollectionService.findMissingSets().stream().map(mtgConverter::convert).toList();
    }

    @GetMapping("/sets")
    public List<MtgSet> findSets() {
        return List.of();
    }
}
