package org.ranthas.mtgcollectionmanager.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Objects;

@Entity
@Table(name = "symbols")
public class MtgSymbol {

    @Id
    @Column(name = "code")
    private String code;

    @Column(name = "symbol")
    private String symbol;

    @Column(name = "image_path")
    private String imagePath;

    public MtgSymbol() {
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        MtgSymbol mtgSymbol = (MtgSymbol) o;
        return Objects.equals(code, mtgSymbol.code);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(code);
    }
}
