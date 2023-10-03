package com.solace.quoteengine.stocksimulator.publisher;

import com.solace.quoteengine.stocksimulator.config.ConfigProperties;
import com.solace.quoteengine.stocksimulator.model.MarketData;
import com.solace.quoteengine.stocksimulator.model.StockSymbol;
import com.solacesystems.jcsmp.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import javax.annotation.PreDestroy;
import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Locale;
import java.util.Random;

@Component
@Slf4j
public class MarketDataStreamer {

    @Autowired
    ConfigProperties configProperties;
    @Autowired
    ResourceLoader resourceLoader;

    // Exchange business logic
    ArrayList<StockSymbol> oTodaySymbols;
    private String marketPrefixId;
    private String marketStatusTopic;
    private String marketInfoTopic;
    private String marketLiveDataTopic;
    private String marketVaDataTopic;
    private String marketReplayTopic;
    // Match engine configuration.


    long currOrderId = 0;
    long iOkOrder = 0;
    long iNgOrder = 0;
    long iMarketDataMsgNum = 0;
    long iLastRateCheckTimeStamp = 0;
    double dMatchRate = 0.0;
    // Market data streamer configuration.
    // Solace related objects.
    private JCSMPProperties properties;
    private JCSMPSession session;
    private XMLMessageProducer prod;
    private Topic topic;
    private TextMessage txtMsg;
    private BytesMessage byteMsg;
    SimpleDateFormat tradeDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.ENGLISH);

    private void initializeProperties() {
        log.info("MarketDataStreamer initializing...");
        this.marketPrefixId = configProperties.MARKET_PREFIX + "/" + configProperties.MARKET_ID + "/";
        this.marketStatusTopic = this.marketPrefixId + configProperties.MARKET_STATUS_TOPIC;
        this.marketInfoTopic = this.marketPrefixId + configProperties.MARKET_INFO_TOPIC;
        this.marketLiveDataTopic = this.marketPrefixId + configProperties.MARKET_LIVE_DATA_TOPIC;
        this.marketVaDataTopic = this.marketPrefixId + configProperties.MARKET_VA_DATA_TOPIC;
        this.marketReplayTopic = this.marketPrefixId + configProperties.MARKET_REPLAY_DATA_TOPIC;
    }

    private void printAllConfigProperties() {
        log.info("=== Properties Used ===");
        log.info("Status Topic: {}}", this.marketStatusTopic);
        log.info("Info Topic: {}", this.marketInfoTopic);
        log.info("Live Data Topic: {}", this.marketLiveDataTopic);
        log.info("VA Data Topic: {}", this.marketVaDataTopic);
        log.info("Replay Data Topic: {}", this.marketReplayTopic);
        log.info("Max Volume/Order: {}", configProperties.MAX_VOL_PER_ORDER);
        log.info("Min Matching Delay: {}", configProperties.MIN_MATCHING_DELAY);
        log.info("Max Matching Delay: {}", configProperties.MAX_MATCHING_DELAY);
        log.info("Rate Sampling: {}", configProperties.MATCH_RATE_SAMPLING_INTERVAL);
        log.info("=== SOLACE Properties ===");
        log.info("Solace Host: {}", configProperties.SOLACE_HOST);
        log.info("Solace User: {}", configProperties.SOLACE_CLIENT_USERNAME + "@" + configProperties.SOLACE_VPN);
    }

    private void init() throws JCSMPException {
        // Create a JCSMP Session

        this.properties = new JCSMPProperties();
        properties.setProperty(JCSMPProperties.HOST, configProperties.SOLACE_HOST);
        properties.setProperty(JCSMPProperties.VPN_NAME, configProperties.SOLACE_VPN);
        properties.setProperty(JCSMPProperties.USERNAME, configProperties.SOLACE_CLIENT_USERNAME);
        properties.setProperty(JCSMPProperties.PASSWORD, configProperties.SOLACE_CLIENT_PASSWORD);

        // Connect to Solace
        this.session = JCSMPFactory.onlyInstance().createSession(properties);

        // Activate a producer.
        // For direct messaging, these methods will never be invoked.
        this.prod = session.getMessageProducer(new JCSMPStreamingPublishEventHandler() {
            public void responseReceived(String messageID) {
                log.info("Producer received response for msg: " + messageID);
            }

            public void handleError(String messageID, JCSMPException e, long timestamp) {
                log.info("Producer received error for msg: {} - {}",
                        messageID, timestamp, e);
            }
        });

        this.txtMsg = JCSMPFactory.onlyInstance().createMessage(TextMessage.class);
        this.byteMsg = JCSMPFactory.onlyInstance().createMessage(BytesMessage.class);
    }

    private void closeMarket() {
        try {
            this.topic = JCSMPFactory.onlyInstance().createTopic(this.marketStatusTopic);
            log.info("The closeMarket is publishing data to topic :{}", topic.toString());
            txtMsg.clearContent();
            txtMsg.setText("EXM999999|END_TRADE|Now we don't accept any orders.|" + System.currentTimeMillis());
            this.prod.send(this.txtMsg, this.topic);
            this.prod.close();
            this.session.closeSession();
            log.info("END TRADE @ {}", tradeDateFormat.format(System.currentTimeMillis()));
        } catch (Exception ex) {
            log.error("Exception occurred while closing market: ", ex);
        }
    }

    public void loadSymbols(String symbolListFileName) {
        Path path = Paths.get(symbolListFileName);
        log.info("SymbolList file details: {}", path.toAbsolutePath());

        BufferedReader br = null;
        Resource resource = resourceLoader.getResource("classpath:" + symbolListFileName);

        try {
            File f = resource.getFile();
            InputStreamReader isr = new InputStreamReader(new FileInputStream(f), "UTF-8");
            br = new BufferedReader(isr);
            String sCurrLine = null;
            String[] sCurrSymbol;
            oTodaySymbols = new ArrayList<StockSymbol>();

            while ((sCurrLine = br.readLine()) != null) {
                sCurrSymbol = sCurrLine.split(",");
                StockSymbol ss = new StockSymbol(sCurrSymbol[0], sCurrSymbol[1]);
                ss.setOpenPrices(Double.parseDouble(sCurrSymbol[2]));
                oTodaySymbols.add(ss);
            }
        } catch (IOException ioe) {
            log.error("Exception occurred while loading symbols: ", ioe);
        }

        for (int i = 0; i < oTodaySymbols.size(); i++) {
            log.info("Current Stock {}: {}, Name: {}, open at: {}", (i + 1), oTodaySymbols.get(i).getId(), oTodaySymbols.get(i).getDisplayName(), oTodaySymbols.get(i).getpOpen());
        }

        try {
            this.init();
        } catch (Exception ex) {
            log.error("Exception occurred while loading symbols: ", ex);
        }
    }

    public void startTrade() {
        try {
            this.iLastRateCheckTimeStamp = System.currentTimeMillis();
            this.topic = JCSMPFactory.onlyInstance().createTopic(this.marketStatusTopic);
            log.info("The startTrade is publishing data to topic :{}", topic.toString());
            txtMsg.clearContent();
            txtMsg.setText("EXM000001|START_TRADE|Now your orders will be processed.|" + System.currentTimeMillis());
            this.prod.send(this.txtMsg, this.topic);
            log.info("START TRADE @ {}", tradeDateFormat.format(System.currentTimeMillis()));
        } catch (Exception ex) {
            log.error("Exception occurred while starting trade: ", ex);
        }

        int iTradingSymbol = 0;
        int iMatchingDelay = 0;
        int iTradingVolume = 0;
        boolean isBuyPrice = false;
        String tradeTimeStamp = null;

        int iAvailableSymbolsToday = this.oTodaySymbols.size();
        long tradeCount = 0;
        while (true) {
            iTradingSymbol = (int) ((Math.random() * iAvailableSymbolsToday));
            iTradingVolume = (int) ((Math.random() * configProperties.MAX_VOL_PER_ORDER) + 1);
            isBuyPrice = (new Random()).nextBoolean();
            StockSymbol currSS = this.oTodaySymbols.get(iTradingSymbol);
            currSS.setvOrderNum(currSS.getvOrderNum() + 1);

            currOrderId++;
            if (currSS.procTrade(isBuyPrice, iTradingVolume)) {
                iOkOrder++;
                publishMarketData(currSS);
            } else {
                iNgOrder++;
            }

            tradeTimeStamp = tradeDateFormat.format(System.currentTimeMillis());
            iMatchingDelay = (int) ((Math.random() * configProperties.MAX_MATCHING_DELAY) + configProperties.MIN_MATCHING_DELAY);
            if (currOrderId % configProperties.MATCH_RATE_SAMPLING_INTERVAL == 0) {
                dMatchRate = ((double) currOrderId / (double) (System.currentTimeMillis() - this.iLastRateCheckTimeStamp)) * 1000.0;
                try {
                    DecimalFormat df = new DecimalFormat("0.000");
                    this.topic = JCSMPFactory.onlyInstance().createTopic(this.marketStatusTopic);
                    log.info("The startTrade-2 is publishing data to topic :{}", topic.toString());
                    this.txtMsg.clearContent();
                    long systemMillis = System.currentTimeMillis();
                    this.txtMsg.setText("EXM000101|ME_PERF_INFO|" + df.format(dMatchRate) + "|" + systemMillis);
                    this.prod.send(this.txtMsg, this.topic);
                    this.txtMsg.setText("EXM000110|ME_ORDER_TOTAL|" + currOrderId + "|" + systemMillis);
                    this.prod.send(this.txtMsg, this.topic);
                } catch (Exception ex) {
                    log.error("Exception occurred while trading: ", ex);
                }
                log.info("Match Engine Performance: {} orders/sec, {} orders finished @ {}", dMatchRate, tradeCount, tradeDateFormat.format(System.currentTimeMillis()));
            }
            tradeCount++;
            busyWaitMicros(iMatchingDelay);
        }
    }

    // Publishing market data
    private void publishMarketData(StockSymbol currSS) {
        MarketData md = new MarketData(this.currOrderId, currSS);
//        log.info("The marketData object is:{}", md);
        // For UTF-8 strings, please ensure you get the bytes in UTF-8.
        // This try...catch... statement is very weak, please complete it if you want to use this code.
        try {
            byteMsg.clearContent();
            topic = JCSMPFactory.onlyInstance().createTopic(this.marketLiveDataTopic + "/" + currSS.getId());
//            log.info("The publishMarketData is publishing data to topic :{}", topic.toString());
            String currSymbolMarketData = new String(md.toString().getBytes("UTF-8"), "UTF-8");
            byteMsg.setElidingEligible(true);
            byteMsg.setData(currSymbolMarketData.getBytes());
            this.prod.send(byteMsg, topic);
            this.iMarketDataMsgNum++;
        } catch (Exception ex) {
            log.error("Exception occurred while publishing data: {}", ex);
        }
    }

    private void busyWaitMicros(long sleepInMicros) {
        long waitUntil = System.nanoTime() + (sleepInMicros * 1000);

        while (waitUntil > System.nanoTime()) {
            ;
        }
    }

    @EventListener
    public void onApplicationEvent(final ApplicationReadyEvent applicationReadyEvent) {
        initializeProperties();
        printAllConfigProperties();
        loadSymbols("myStockList.txt");
        startTrade();
    }

    @PreDestroy
    public void destroy() {
        closeMarket();
    }
}
