package org.ranthas.mtgcollectionmanager.constant;

import java.time.format.DateTimeFormatter;

public class DateTimeConstants {
    public static final String DATE_PATTERN = "yyyy-MM-dd";
    public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern(DATE_PATTERN);
}
