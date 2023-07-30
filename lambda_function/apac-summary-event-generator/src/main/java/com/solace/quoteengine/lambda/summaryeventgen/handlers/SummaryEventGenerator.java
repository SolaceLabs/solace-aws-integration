package com.solace.quoteengine.lambda.summaryeventgen.handlers;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.solace.quoteengine.lambda.summaryeventgen.model.SummaryEvent;
import com.solacesystems.jcsmp.*;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.time.Instant;

public class SummaryEventGenerator implements RequestStreamHandler {
    private JCSMPProperties properties;
    private JCSMPSession session;
    private XMLMessageProducer prod;
    private TextMessage txtMsg;


    private final String SOLACE_HOST = System.getenv("SOLACE_HOST_URL");
    private final String SOLACE_VPN = System.getenv("SOLACE_VPN");
    private final String SOLACE_CLIENT_USERNAME = System.getenv("SOLACE_USERNAME");
    private final String SOLACE_CLIENT_PASSWORD = System.getenv("SOLACE_PASSWORD");
    private final String SOLACE_TOPIC = System.getenv("SUMMARY_EVENT_TOPIC");

    @Override
    public void handleRequest(InputStream inputStream, OutputStream outputStream, Context context) throws IOException {

        try {
            init();
            SummaryEvent summaryEvent = createSummaryEvent();
            publishEvent(summaryEvent);
            context.getLogger().log("Summary Event published:" + summaryEvent.toString() + "\n");

        } catch (Exception e) {
            context.getLogger().log("Exception occurred :" + e.getMessage() + "\n");
        }
    }

    public void publishEvent(SummaryEvent summaryEvent) throws JCSMPException {
        txtMsg.clearContent();
        final Topic topic = JCSMPFactory.onlyInstance().createTopic(SOLACE_TOPIC);
        txtMsg.setText(summaryEvent.toString());
        this.prod.send(txtMsg, topic);
    }

    public SummaryEvent createSummaryEvent() {
        SummaryEvent event = new SummaryEvent();
        event.setRegionId("eu-northeast-1");
        event.setRegionName("Tokyo");
        event.setTimezoneName("JST");
        event.setTotalEventsProcessed((long) (Math.random() * 10000));
        event.setTotalEventsPending((long) (Math.random() * 1000));
        event.setEventTimeStamp(Instant.now().getEpochSecond());
        return event;
    }

    public void init() throws JCSMPException {
        this.properties = new JCSMPProperties();
        properties.setProperty(JCSMPProperties.HOST, SOLACE_HOST);
        properties.setProperty(JCSMPProperties.VPN_NAME, SOLACE_VPN);
        properties.setProperty(JCSMPProperties.USERNAME, SOLACE_CLIENT_USERNAME);
        properties.setProperty(JCSMPProperties.PASSWORD, SOLACE_CLIENT_PASSWORD);
        this.session = JCSMPFactory.onlyInstance().createSession(properties);
        this.prod = session.getMessageProducer(new JCSMPStreamingPublishEventHandler() {
            public void responseReceived(String messageID) {
            }

            public void handleError(String messageID, JCSMPException e, long timestamp) {
            }
        });
        this.txtMsg = JCSMPFactory.onlyInstance().createMessage(TextMessage.class);
    }
}