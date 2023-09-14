package com.solace.quoteengine.stocksimulator.model;

import java.text.DecimalFormat;
import java.util.Date;

/**
 * Created by hhjau on 2018/04/19.
 */
public class MarketData {
    private long orderId;
    private long symbolOrderId;
    private String id;
    private String displayName;
    private double pOpen;
    private double pHigh;
    private double pLow;
    private double pClose;
    private double pDiff;
    private long vTotal;
    private long vCurrent;
    private boolean isBuyPrice;
    private Date tradeDateTime;
    private long lastUpdated;
    private boolean isSnapshot;

    public MarketData(String id, String displayName) {
        this.id = id;
        this.displayName = displayName;
    }

    public MarketData(long orderId, StockSymbol ss) {
        this.orderId = orderId;
        this.symbolOrderId = ss.getvOrderNum();
        this.id = ss.getId();
        this.displayName = ss.getDisplayName();
        this.pOpen = ss.getpOpen();
        this.pHigh = ss.getpHigh();
        this.pLow = ss.getpLow();
        this.pClose = ss.getpClose();
        this.pDiff = ss.getpDiff();
        this.vCurrent = ss.getvCurrent();
        this.vTotal = ss.getvTotal();
        this.lastUpdated = ss.getLastUpdated();
    }

    @Override
    public String toString() {
        DecimalFormat df = new DecimalFormat("0.00");
        StringBuffer sb = new StringBuffer();
        sb.append(this.orderId).append("|")
                .append(this.id).append("|")
                .append(this.displayName).append("|")
                .append(this.symbolOrderId).append("|")
                .append(df.format(this.pOpen)).append("|")
                .append(df.format(this.pHigh)).append("|")
                .append(df.format(this.pLow)).append("|")
                    .append(df.format(this.pClose)).append("|")
                .append(df.format(this.pDiff)).append("|")
                .append(this.vCurrent).append("|")
                .append(this.vTotal).append("|")
                .append(this.lastUpdated);

        return sb.toString();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public double getPOpen() {
        return pOpen;
    }

    public void setPOpen(double pOpen) {
        this.pOpen = pOpen;
    }

    public double getPHigh() {
        return pHigh;
    }

    public void setPHigh(double pHigh) {
        this.pHigh = pHigh;
    }

    public double getPLow() {
        return pLow;
    }

    public void setPLow(double pLow) {
        this.pLow = pLow;
    }

    public double getPClose() {
        return pClose;
    }

    public void setPClose(double pClose) {
        this.pClose = pClose;
    }

    public long getvTotal() {
        return vTotal;
    }

    public void setvTotal(long vTotal) {
        this.vTotal = vTotal;
    }

    public long getvCurrent() {
        return vCurrent;
    }

    public void setvCurrent(long vCurrent) {
        this.vCurrent = vCurrent;
    }

    public boolean isBuyPrice() {
        return isBuyPrice;
    }

    public void setBuyPrice(boolean buyPrice) {
        isBuyPrice = buyPrice;
    }

    public Date getTradeDateTime() {
        return tradeDateTime;
    }

    public void setTradeDateTime(Date tradeDateTime) {
        this.tradeDateTime = tradeDateTime;
    }

    public long getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(long lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public double getpDiff() {
        return pDiff;
    }

    public void setpDiff(double pDiff) {
        this.pDiff = pDiff;
    }

    public long getOrderId() {
        return orderId;
    }

    public void setOrderId(long orderId) {
        this.orderId = orderId;
    }
}
