package org.ranthas.mtgcmapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ScryfallList<T> {

    @JsonProperty(value = "has_more")
    private Boolean hasMore;

    @JsonProperty(value = "next_page")
    private String nextPage;

    private List<T> data;

    public ScryfallList() {
    }

    public Boolean getHasMore() {
        return hasMore;
    }

    public void setHasMore(Boolean hasMore) {
        this.hasMore = hasMore;
    }

    public String getNextPage() {
        return nextPage == null ?
                null :
                nextPage.replace("%3A", ":");
    }

    public void setNextPage(String nextPage) {
        this.nextPage = nextPage;
    }

    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }
}
