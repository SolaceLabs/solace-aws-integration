package com.solace.quoteengine.admin.service;

import com.solace.quoteengine.admin.config.SolaceConfigurationProps;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

@Service
@Slf4j
public class SolaceRestApiClient {

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    SolaceConfigurationProps solaceConfigurationProps;

    public void sendClientProfileOperationRequest(final String request) {

        final HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(solaceConfigurationProps.solaceRestApiToken);

        HttpEntity<String> requestEntity = new HttpEntity<>(request, headers);
        final String requestUrl = solaceConfigurationProps.solaceRestApiUrl + "/" + "requests" + "/" + "clientProfileRequests";
        log.info("Request url :{}", requestUrl);

        try {
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(requestUrl, requestEntity, String.class);
            if (responseEntity.getStatusCode().is2xxSuccessful()) {
                String responseBody = responseEntity.getBody();
                JSONObject json = new JSONObject(responseBody);
                final String requestId = ((JSONObject) json.get("data")).get("id").toString();
                log.info("RequestId: {}", requestId);
                Thread.sleep(3 * 1000);
                boolean isRequestFinished = false;
                do {
                    isRequestFinished = getRequestDetails(requestId);
                } while (!isRequestFinished);
            } else {
                log.error("Request failed!: {}", request);
                Thread.sleep(3 * 1000);
            }
        } catch (Exception exception) {
            log.error("Exception occurred while processing request :{}, exception is :{}", request, exception.getMessage());
            try {
                Thread.sleep(3 * 1000);
            } catch (InterruptedException e) {
                log.error("Exception occurred while processing request :{}, exception is :{}", request, e.getMessage());
            }
        }
    }

    private boolean getRequestDetails(final String requestId) {
        boolean isRequestFinished = false;
        final HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(solaceConfigurationProps.solaceRestApiToken);
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        final String requestUrl = solaceConfigurationProps.solaceRestApiUrl + "/" + "requests" + "/" + requestId;
        log.info("Request url :{}", requestUrl);

        try {
            ResponseEntity<String> responseEntity = restTemplate.exchange(requestUrl, HttpMethod.GET, requestEntity, String.class);
            if (responseEntity.getStatusCode().is2xxSuccessful()) {
                log.info("Status query request successful!");
                String responseBody = responseEntity.getBody();
                JSONObject json = new JSONObject(responseBody);
                final String requestStatus = ((JSONObject) json.get("data")).get("adminProgress").toString();
                if ("completed".equals(requestStatus)) isRequestFinished = true;
                Thread.sleep(2 * 1000);
            } else {
                log.error("Request failed!:{}", requestUrl);
            }
        } catch (Exception exception) {
            log.error("Exception occurred while processing request :{}, exception is :{}", requestUrl, exception.getMessage());
        }
        return isRequestFinished;
    }


}
