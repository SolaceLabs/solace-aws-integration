package com.solace.quoteengine.admin.model;

/**
 * Created by hhjau on 2018/04/19.
 */
public class StockSymbol {
    private String displayName;
    private String id;
    private String description;
    private long lastUpdated;
    private double pOpen;
    private double pHigh;
    private double pLow;
    private double pClose;
    private double pDiff;
    private long vTotal;
    private long vCurrent;
    private long vOrderNum;
    private long vNextPriceVol;
    private double pPriceUnit;
    private double pLimitUp;
    private double pLimitDown;
    private boolean isLimitUp;
    private boolean isLimitDown;

    public StockSymbol(String id, String displayName) {
        this.id = id;
        this.displayName = displayName;
        this.pPriceUnit = 0.05;
        this.vNextPriceVol = 100;
        this.lastUpdated = (new java.util.Date()).getTime();
        System.out.println("Generating a Stock Symbol..." + this.getId() + ", " + this.getDisplayName());
    }

    private StockSymbol() {
        System.out.println("Generating a Stock Symbol...");
    }

    public void setOpenPrices(double prevClosePrice) {
        this.pOpen = prevClosePrice;
        this.pClose = prevClosePrice;
        this.pHigh = prevClosePrice;
        this.pLow = prevClosePrice;
        this.pLimitUp = this.pOpen * 1.1;
        this.pLimitDown = this.pOpen * 0.9;
    }

    public boolean procTrade(boolean isBuyPrice, long tradeVol) {
        this.vCurrent = tradeVol;
        this.vTotal = this.vTotal + this.vCurrent;
        if (this.vTotal > this.vNextPriceVol) {
            if (isBuyPrice) {
                this.isLimitDown = (this.isLimitDown?false:true);
                if (!isLimitUp) {
                    this.pClose = this.pClose + this.pPriceUnit;
                    this.isLimitUp = (this.pClose >= this.pLimitUp?true:false);
                }
            }
            else {
                this.isLimitUp = (this.isLimitUp?false:true);
                if (!isLimitDown) {
                    this.pClose = this.pClose - this.pPriceUnit;
                    this.isLimitDown = (this.pClose <= this.pLimitDown?true:false);
                }
            }
            this.vNextPriceVol = this.vNextPriceVol + 777;
        }
        this.pDiff = this.pClose - this.pOpen;
        this.updateHLPrice();
        this.lastUpdated = (new java.util.Date()).getTime();
        return true;
    }

    private void updateHLPrice() {
        if (this.pClose > this.pHigh)
            this.pHigh = this.pClose;
        else if (this.pClose < this.pLow)
            this.pLow = this.pClose;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getpOpen() {
        return pOpen;
    }

    public void setpOpen(double pOpen) {
        this.pOpen = pOpen;
    }

    public double getpHigh() {
        return pHigh;
    }

    public void setpHigh(double pHigh) {
        this.pHigh = pHigh;
    }

    public double getpLow() {
        return pLow;
    }

    public void setpLow(double pLow) {
        this.pLow = pLow;
    }

    public double getpClose() {
        return pClose;
    }

    public void setpClose(double pClose) {
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

    public long getvNextPriceVol() {
        return vNextPriceVol;
    }

    public void setvNextPriceVol(long vNextPriceVol) {
        this.vNextPriceVol = vNextPriceVol;
    }

    public double getpDiff() {
        return pDiff;
    }

    public long getLastUpdated() {
        return lastUpdated;
    }

    public long getvOrderNum() {
        return vOrderNum;
    }

    public void setvOrderNum(long vOrderNum) {
        this.vOrderNum = vOrderNum;
    }
}
