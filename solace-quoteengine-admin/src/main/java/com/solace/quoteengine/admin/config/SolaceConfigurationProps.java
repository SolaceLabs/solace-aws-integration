package com.solace.quoteengine.admin.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SolaceConfigurationProps {

    @Value("${solace.userName}")
    public String solaceUserName;
    @Value("${solace.password}")
    public String solacePassword;
    @Value("${solace.sempUrl}")
    public String solaceSempUrl;
    @Value("${solace.restApiUrl}")
    public String solaceRestApiUrl;
    @Value("${solace.restApiToken}")
    public String solaceRestApiToken;
    @Value("${solace.vpnName}")
    public String vpnName;
    @Value("${solace.sempVersion}")
    public String sempVersion;
    final public String SEMP_BEGIN_LINE = "<rpc semp-version=\"" + sempVersion + "\">\n";
    final public String SEMP_END_LINE = "</rpc>\n";

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
