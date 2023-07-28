package com.solace.quoteengine.admin.apis;

import com.solace.quoteengine.admin.config.SolaceConfigurationProps;
import com.solace.quoteengine.admin.service.SolaceRestApiClient;
import com.solace.quoteengine.admin.service.SolaceSEMPClient;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class SempController {

    @Autowired
    private SolaceConfigurationProps solaceConfigurationProps;

    @Autowired
    SolaceRestApiClient solaceRestApiClient;

    @Autowired
    SolaceSEMPClient solaceSEMPClient;

    @RequestMapping(value = "/ShiftSpeedOp/{clientLevel}")
    public void VpnOpen(@PathVariable String clientLevel, @RequestParam("speed") String speed) {
        // TODO: Should validate "speed" as integer.
        final String clientProfileName = "cp-" + clientLevel;
        int speedInt = Integer.parseInt(speed);

        JSONObject clientProfileUpdateRequest = new JSONObject();
        clientProfileUpdateRequest.put("operation", "update");

        JSONObject innerRequest = new JSONObject();
        innerRequest.put("clientProfileName", clientProfileName);
        innerRequest.put("elidingEnabled", true);
        innerRequest.put("elidingDelay", speedInt);

        clientProfileUpdateRequest.put("clientProfile", innerRequest);

        log.info("RestAPI REQ: {}", clientProfileUpdateRequest);
        solaceRestApiClient.sendClientProfileOperationRequest(clientProfileUpdateRequest.toString());
    }

    private void createClientProfiles() {
        log.info("Creating client profiles");
        createClientProfile(solaceConfigurationProps.level1UserName, solaceConfigurationProps.level1DefaultSpeed);
        createClientProfile(solaceConfigurationProps.level2UserName, solaceConfigurationProps.level2DefaultSpeed);
        createClientProfile(solaceConfigurationProps.level3UserName, solaceConfigurationProps.level3DefaultSpeed);
        createClientProfile(solaceConfigurationProps.level4UserName, solaceConfigurationProps.level4DefaultSpeed);
    }

    private void createClientProfile(final String userName, String defaultSpeed) {
        int defaultSpeedInt = Integer.parseInt(defaultSpeed);
        final String clientProfileName = "cp-" + userName;
        log.info("Creating client profile:{}", clientProfileName);

        JSONObject clientProfileRequest = new JSONObject();
        clientProfileRequest.put("operation", "create");

        JSONObject innerRequest = new JSONObject();
        innerRequest.put("clientProfileName", clientProfileName);
        innerRequest.put("elidingEnabled", true);
        innerRequest.put("elidingDelay", defaultSpeedInt);

        clientProfileRequest.put("clientProfile", innerRequest);

        log.info("RestAPI REQ: {}", clientProfileRequest);

        solaceRestApiClient.sendClientProfileOperationRequest(clientProfileRequest.toString());
    }

    private void createClientUsernamesUsingSEMP() {
        solaceSEMPClient.createClientUsername("customer-" + solaceConfigurationProps.level1UserName, "cp-" + solaceConfigurationProps.level1UserName);
        solaceSEMPClient.createClientUsername("customer-" + solaceConfigurationProps.level2UserName, "cp-" + solaceConfigurationProps.level2UserName);
        solaceSEMPClient.createClientUsername("customer-" + solaceConfigurationProps.level3UserName, "cp-" + solaceConfigurationProps.level3UserName);
        solaceSEMPClient.createClientUsername("customer-" + solaceConfigurationProps.level4UserName, "cp-" + solaceConfigurationProps.level4UserName);
    }


    @EventListener
    public void onApplicationEvent(final ApplicationReadyEvent applicationReadyEvent) {
        createClientProfiles();
        createClientUsernamesUsingSEMP();
    }
}
