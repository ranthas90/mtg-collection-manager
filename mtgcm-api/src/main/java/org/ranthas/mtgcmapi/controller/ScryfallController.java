package org.ranthas.mtgcmapi.controller;

import org.ranthas.mtgcmapi.converter.MtgConverter;
import org.ranthas.mtgcmapi.dto.LoadSetResponse;
import org.ranthas.mtgcmapi.dto.SetDto;
import org.ranthas.mtgcmapi.service.ScryfallService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "${origin.url}")
public class ScryfallController {

    private final ScryfallService scryfallService;
    private final MtgConverter mtgConverter;

    public ScryfallController(ScryfallService scryfallService, MtgConverter mtgConverter) {
        this.scryfallService = scryfallService;
        this.mtgConverter = mtgConverter;
    }

    @GetMapping("/missing-sets")
    public List<SetDto> findMissingSets() {
        return scryfallService.findMissingSets().stream().map(mtgConverter::convert).toList();
    }

    @PostMapping("/load-collections")
    public List<LoadSetResponse> loadCollectionSets(@RequestBody List<String> setCodes) {
        return scryfallService.loadSets(setCodes);
    }
}
