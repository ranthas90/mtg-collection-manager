package org.ranthas.mtgcollectionmanager.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Objects;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ScryfallSymbol {

    private String symbol;

    @JsonProperty("svg_uri")
    private String svgPath;

    public ScryfallSymbol() {
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getSvgPath() {
        return svgPath;
    }

    public void setSvgPath(String svgPath) {
        this.svgPath = svgPath;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        ScryfallSymbol that = (ScryfallSymbol) o;
        return Objects.equals(symbol, that.symbol);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(symbol);
    }

    public String getCode() {
        int start = svgPath.lastIndexOf("/") + 1;
        int end = svgPath.indexOf(".svg");

        return svgPath.substring(start, end);
    }
}
