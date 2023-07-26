package com.solace.quoteengine.admin.service;

import com.solace.quoteengine.admin.model.StockSymbol;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

@Service
@Slf4j
public class StartupTasks {
    @Autowired
    ResourceLoader resourceLoader;

    private static ArrayList<String[]> oTodaySymbols = new ArrayList<String[]>();
    private static ArrayList<StockSymbol> availableSymbols = new ArrayList<>();

    @EventListener
    public void onApplicationEvent(final ApplicationReadyEvent applicationReadyEvent) {
        loadSymbols("myStockList.txt");
        log.info("Starting the SolEx Portal..");
    }


    private void loadSymbols(String symbolListFileName) {
        Path path = Paths.get(symbolListFileName);
        log.info("Loaded from: {}", path.toAbsolutePath());

        BufferedReader br = null;

        Resource resource = resourceLoader.getResource("classpath:" + symbolListFileName);
        try {
            File f = resource.getFile();
            InputStreamReader isr = new InputStreamReader(new FileInputStream(f), "UTF-8");
            br = new BufferedReader(isr);

            String sCurrLine = null;
            String[] sCurrSymbol;
            StockSymbol currSymbol = null;


            while ((sCurrLine = br.readLine()) != null) {
                sCurrSymbol = sCurrLine.split(",");
                oTodaySymbols.add(sCurrSymbol);

                // Load each symbol as an object
                currSymbol = new StockSymbol(sCurrSymbol[0], sCurrSymbol[1]);
                currSymbol.setOpenPrices(Double.parseDouble(sCurrSymbol[2]));
                availableSymbols.add(currSymbol);
            }
        } catch (IOException ioe) {
            ioe.printStackTrace();
        }

        for (int i = 0; i < oTodaySymbols.size(); i++) {
            log.info("Current Stock {}: {}, Name: {}, open at: {}", (i + 1), oTodaySymbols.get(i)[0], oTodaySymbols.get(i)[1], Double.parseDouble(oTodaySymbols.get(i)[2]));
        }
    }

    public static ArrayList<StockSymbol> getAvailableSymbols() {
        return availableSymbols;
    }
}
