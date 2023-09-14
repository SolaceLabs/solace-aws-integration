package com.solace.quoteengine.processor.globaleodeventprocessor.model;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@ToString
public class EODEvent {

    private String regionId;
    private String regionName;
    private String timezoneName;
    private long totalEventsProcessed;
    private long totalEventsPending;
}
