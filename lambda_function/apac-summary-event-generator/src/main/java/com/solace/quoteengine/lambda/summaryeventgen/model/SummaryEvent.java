package com.solace.quoteengine.lambda.summaryeventgen.model;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class SummaryEvent {

    private String regionId;
    private String regionName;
    private String timezoneName;
    private long totalEventsProcessed;
    private long totalEventsPending;

    private long eventTimeStamp;

    public SummaryEvent(String json) {
        Gson gson = new Gson();
        SummaryEvent eodEvent = gson.fromJson(json, SummaryEvent.class);
        this.regionId = eodEvent.getRegionId();
        this.regionName = eodEvent.getRegionName();
        this.timezoneName = eodEvent.getTimezoneName();
        this.totalEventsProcessed = eodEvent.getTotalEventsProcessed();
        this.totalEventsPending = eodEvent.getTotalEventsProcessed();
        this.eventTimeStamp = eodEvent.getEventTimeStamp();
    }

    public SummaryEvent() {
    }

    public String toString() {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(this);
    }

    public String getRegionId() {
        return regionId;
    }

    public void setRegionId(String regionId) {
        this.regionId = regionId;
    }

    public String getRegionName() {
        return regionName;
    }

    public void setRegionName(String regionName) {
        this.regionName = regionName;
    }

    public String getTimezoneName() {
        return timezoneName;
    }

    public void setTimezoneName(String timezoneName) {
        this.timezoneName = timezoneName;
    }

    public long getTotalEventsProcessed() {
        return totalEventsProcessed;
    }

    public void setTotalEventsProcessed(long totalEventsProcessed) {
        this.totalEventsProcessed = totalEventsProcessed;
    }

    public long getTotalEventsPending() {
        return totalEventsPending;
    }

    public void setTotalEventsPending(long totalEventsPending) {
        this.totalEventsPending = totalEventsPending;
    }

    public long getEventTimeStamp() {
        return eventTimeStamp;
    }

    public void setEventTimeStamp(long eventTimeStamp) {
        this.eventTimeStamp = eventTimeStamp;
    }
}



