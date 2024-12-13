package org.ranthas.mtgcollectionmanager.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.UuidGenerator;

import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "symbols")
public class Symbol {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "code")
    private String code;

    @Column(name = "image_path")
    private String imagePath;

    public Symbol() {
    }

    public Symbol(String symbol, String symbolPath) {
        id = null;
        code = symbol;
        imagePath = symbolPath;
    }

    public UUID getId() {
        return this.id;
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

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    @Override
    public boolean equals(Object o) {
        return id.equals(((Symbol) o).getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, code, imagePath);
    }

    @Override
    public String toString() {
        return "{" +
                " id='" + getId() + "'" +
                ", code='" + getCode() + "'" +
                ", imagePath='" + getImagePath() + "'" +
                "}";
    }
}
