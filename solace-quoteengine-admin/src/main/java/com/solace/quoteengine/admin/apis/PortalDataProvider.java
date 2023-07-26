package com.solace.quoteengine.admin.apis;


import com.solace.quoteengine.admin.model.StockSymbol;
import com.solace.quoteengine.admin.service.StartupTasks;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;

@RestController
@Slf4j
public class PortalDataProvider {

    @Autowired
    StartupTasks startupTasks;

    @RequestMapping(value = "/api/general/listStocks", method = RequestMethod.GET)
    public ArrayList<StockSymbol> getGeneralListStocks(HttpSession session, HttpServletRequest request) {
        log.info("The guest IP: {}, Agent: {}) logged to get stock list.", request.getRemoteAddr(), request.getHeader("User-Agent"));
        return startupTasks.getAvailableSymbols();
    }


}
