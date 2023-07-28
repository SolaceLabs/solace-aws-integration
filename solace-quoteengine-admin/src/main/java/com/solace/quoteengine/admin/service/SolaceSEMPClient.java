package com.solace.quoteengine.admin.service;

import com.solace.quoteengine.admin.config.SolaceConfigurationProps;
import io.swagger.client.ApiClient;
import io.swagger.client.ApiException;
import io.swagger.client.api.MsgVpnApi;
import io.swagger.client.model.MsgVpnClientUsername;
import io.swagger.client.model.MsgVpnClientUsernameResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;


@Service
@Slf4j
public class SolaceSEMPClient {

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    SolaceConfigurationProps solaceConfigurationProps;

    ApiClient defaultClient;
    MsgVpnApi apiInstance;

    public void createClientUsername(final String clientUserName, final String clientProfileName) {
        defaultClient = new ApiClient();
        defaultClient.setBasePath(solaceConfigurationProps.solaceSempUrl);
        defaultClient.setUsername(solaceConfigurationProps.solaceSempUsername);
        defaultClient.setPassword(solaceConfigurationProps.solaceSempPassword);
        apiInstance = new MsgVpnApi(defaultClient);

        MsgVpnClientUsername body = new MsgVpnClientUsername();
        body.clientUsername(clientUserName);
        body.clientProfileName(clientProfileName);
        body.setPassword("password");
        body.enabled(true);
        List<String> select = Arrays.asList("clientUsername");
        try {
            MsgVpnClientUsernameResponse result = apiInstance.createMsgVpnClientUsername(body, solaceConfigurationProps.solaceSempBrokerName, "", select);
            System.out.println(result);
        } catch (ApiException e) {
            log.error("Exception when calling AllApi#createMsgVpnClientUsername, error is:{}", e.getMessage());
        }
    }
}
