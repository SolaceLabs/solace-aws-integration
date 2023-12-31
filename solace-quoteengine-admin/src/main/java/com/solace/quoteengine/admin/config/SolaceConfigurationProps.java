package com.solace.quoteengine.admin.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SolaceConfigurationProps {

    @Value("${solace.semp.url}")
    public String solaceSempUrl;

    @Value("${solace.semp.username}")
    public String solaceSempUsername;

    @Value("${solace.semp.password}")
    public String solaceSempPassword;

    @Value("${solace.semo.brokername}")
    public String solaceSempBrokerName;


    @Value("${solace.restApiUrl}")
    public String solaceRestApiUrl;
    @Value("${solace.restApiToken}")
    public String solaceRestApiToken;

    @Value("${app.user.level1.name}")
    public String level1UserName;
    @Value("${app.user.level1.speed}")
    public String level1DefaultSpeed;
    @Value("${app.user.level2.name}")
    public String level2UserName;
    @Value("${app.user.level2.speed}")
    public String level2DefaultSpeed;
    @Value("${app.user.level3.name}")
    public String level3UserName;
    @Value("${app.user.level3.speed}")
    public String level3DefaultSpeed;
    @Value("${app.user.level4.name}")
    public String level4UserName;
    @Value("${app.user.level4.speed}")
    public String level4DefaultSpeed;
}
