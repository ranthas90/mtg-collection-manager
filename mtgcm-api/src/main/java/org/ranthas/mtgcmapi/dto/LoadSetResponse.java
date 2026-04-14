package org.ranthas.mtgcmapi.dto;

public class LoadSetResponse {

    private final String setCode;
    private final boolean success;
    private final long timeTaken;

    private LoadSetResponse(String setCode, boolean success, long timeTaken)  {
        this.setCode = setCode;
        this.success = success;
        this.timeTaken = timeTaken;
    }

    public static LoadSetResponse success(String setCode, long startTime) {
        return new LoadSetResponse(setCode, true, System.currentTimeMillis() - startTime);
    }

    public static LoadSetResponse error(String setCode, long startTime) {
        return new LoadSetResponse(setCode, false, System.currentTimeMillis() - startTime);
    }

    public String getSetCode() {
        return setCode;
    }

    public boolean isSuccess() {
        return success;
    }

    public long getTimeTaken() {
        return timeTaken;
    }
}
