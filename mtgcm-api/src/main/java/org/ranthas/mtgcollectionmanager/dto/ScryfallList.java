package org.ranthas.mtgcollectionmanager.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ScryfallList<T> {

    private List<T> data;

    @JsonProperty("has_more")
    private Boolean hasMore;

    @JsonProperty("next_page")
    private String nextPage;

    public ScryfallList() {
    }

    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }

    public Boolean getHasMore() {
        return hasMore;
    }

    public void setHasMore(Boolean hasMore) {
        this.hasMore = hasMore;
    }

    public String getNextPage() {
        return nextPage.replace("%3A", ":");
    }

    public void setNextPage(String nextPage) {
        this.nextPage = nextPage;
    }
}
