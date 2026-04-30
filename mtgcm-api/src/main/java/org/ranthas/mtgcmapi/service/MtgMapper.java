package org.ranthas.mtgcmapi.service;

import org.ranthas.mtgcmapi.entity.MtgSet;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.module.SimpleModule;

import java.io.File;

@Component
public class MtgMapper {

    private final ObjectMapper objectMapper;

    public MtgMapper() {

        SimpleModule module = new SimpleModule();
        module.addSerializer(MtgSet.class, new MtgSetSerializer());
        module.addDeserializer(MtgSet.class, new MtgSetDeserializer());

        this.objectMapper = JsonMapper.builder().addModule(module).build();
    }

    public File writeSet(MtgSet set) {
        File file = new File("_" + set.getCode() + ".json");
        objectMapper.writeValue(file, set);
        return file;
    }

    public MtgSet deserialize(File file) {
        return objectMapper.readValue(file, MtgSet.class);
    }
}
