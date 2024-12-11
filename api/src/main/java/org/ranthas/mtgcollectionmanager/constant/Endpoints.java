package org.ranthas.mtgcollectionmanager.constant;

public class Endpoints {
    public static final String SETS = "/sets";
    public static final String SET_BY_ID = SETS + "/{id}";
    public static final String SET_CARDS = SET_BY_ID + "/cards";
    public static final String SET_STATS = SET_BY_ID + "/stats";
    public static final String CARD_BY_ID = "/cards/{id}";
}
