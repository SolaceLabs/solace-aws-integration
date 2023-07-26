package com.solace.quoteengine.admin.apis;

import com.solace.quoteengine.admin.config.SolaceConfigurationProps;
import com.solace.quoteengine.admin.service.SolaceRestApiClient;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@Slf4j
public class SempController {


    @Autowired
    private SolaceConfigurationProps solaceConfigurationProps;

    @Autowired
    SolaceRestApiClient solaceRestApiClient;

    private HashMap<String, Boolean> vpnStatus;

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


    private void cleanUpClientProfiles() {
        log.info("Cleaning up client profiles");
        cleanUpClientProfile(solaceConfigurationProps.level1UserName);
        cleanUpClientProfile(solaceConfigurationProps.level2UserName);
        cleanUpClientProfile(solaceConfigurationProps.level3UserName);
        cleanUpClientProfile(solaceConfigurationProps.level4UserName);
    }

    private void cleanUpClientProfile(final String userName) {
        final String clientProfileName = "cp-" + userName;
        log.info("Cleaning up client profile:{}", clientProfileName);
        JSONObject requestBody = new JSONObject();
        requestBody.put("operation", "delete");

        JSONObject clientProfileObject = new JSONObject();
        clientProfileObject.put("clientProfileName", clientProfileName);
        requestBody.put("clientProfile", clientProfileObject);

        log.info("RestAPI REQ: {}", requestBody);

        solaceRestApiClient.sendClientProfileOperationRequest(requestBody.toString());
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

    /*private void createUsers() {
        createUser(solaceConfigurationProps.level1UserName);
        createUser(solaceConfigurationProps.level2UserName);
        createUser(solaceConfigurationProps.level3UserName);
        createUser(solaceConfigurationProps.level4UserName);
    }


    private void createUser(final String userName) {
        *//*final String clientProfileName = "cp-" + userName;
        final String sempRequest = solaceConfigurationProps.SEMP_BEGIN_LINE +
                "<client-profile>" +
                "<name>" + cpName + "</name>" +
                "<vpn-name>" + solaceConfigurationProps.vpnName + "</vpn-name>" +
                "<eliding>" + "<delay>" +
                "<milliseconds>" + defaultSpeedInt + "</milliseconds>" +
                "</delay>" + "</eliding>" +
                "</client-profile>" +
                solaceConfigurationProps.SEMP_END_LINE;

        System.out.println("SEMP REQ: " + sempRequest);

        sendSempRequest(sempRequest);*//*
    }*/

    @EventListener
    public void onApplicationEvent(final ApplicationReadyEvent applicationReadyEvent) {
//        cleanUpClientProfiles();
        createClientProfiles();
//        createUsers();
    }
}
