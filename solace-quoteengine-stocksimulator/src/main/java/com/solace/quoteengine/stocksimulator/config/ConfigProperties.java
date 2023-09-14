package com.solace.quoteengine.stocksimulator.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfigProperties {

    @Value("${MARKET_PREFIX}")
    public String MARKET_PREFIX;
    @Value("${MARKET_ID}")
    public String MARKET_ID;
    @Value("${MARKET_STATUS_TOPIC}")
    public String MARKET_STATUS_TOPIC;
    @Value("${MARKET_INFO_TOPIC}")
    public  String MARKET_INFO_TOPIC;
    @Value("${MARKET_LIVE_DATA_TOPIC}")
    public  String MARKET_LIVE_DATA_TOPIC;
    @Value("${MARKET_VA_DATA_TOPIC}")
    public  String MARKET_VA_DATA_TOPIC;
    @Value("${MARKET_REPLAY_DATA_TOPIC}")
    public  String MARKET_REPLAY_DATA_TOPIC;
    @Value("${TRADING_CAPABILITY}")
    public  long TRADING_CAPABILITY;
    @Value("${MAX_VOL_PER_ORDER}")
    public  int MAX_VOL_PER_ORDER;
    @Value("${MIN_MATCHING_DELAY}")
    public  int MIN_MATCHING_DELAY;
    @Value("${MAX_MATCHING_DELAY}")
    public  int MAX_MATCHING_DELAY;
    @Value("${MATCH_RATE_SAMPLING_INTERVAL}")
    public  int MATCH_RATE_SAMPLING_INTERVAL;
    @Value("${SOLACE_HOST}")
    public  String SOLACE_HOST ;
    @Value("${SOLACE_VPN}")
    public  String SOLACE_VPN;
    @Value("${SOLACE_CLIENT_USERNAME}")
    public  String SOLACE_CLIENT_USERNAME;
    @Value("${SOLACE_CLIENT_PASSWORD}")
    public  String SOLACE_CLIENT_PASSWORD;

}
