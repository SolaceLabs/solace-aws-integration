import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { LiveStockPriceService } from './live-stock-price.service';

@Injectable({
  providedIn: 'root'
})
export class MsgRateCalculatorService {
  public iMdMsgNum = 0;
  private iLastMsgReceivedNum = 0;
  public fMdTotalBwUsage = 0.0;
  private sBwUnit = '';
  public fMdMsgRate = 0.0;
  public iMdTotalBwUsage = 0.0;
  // 我還是覺得比較好的方式是把數字傳出去外面，讓View端決定怎麼顯示
  public nMdMsgRate = new BehaviorSubject<number>(this.fMdMsgRate);
  public strMdTotalBwUsage = new BehaviorSubject<string>(this.iMdTotalBwUsage.toString());
  private MD_RATE_SAMPLING_INTERVAL = 3000;  // milliseconds
  private funcCalcCurrentStat;

  constructor(private liveStockPriceSvc: LiveStockPriceService) {
  }

  public startCalc() {
    this.iMdMsgNum = 0;
    this.iLastMsgReceivedNum = 0;
    this.calcCurrentStat();
    // Subscribe livedata and define the message handler.
    this.liveStockPriceSvc.mySolclient.onMessage
      // .pipe(filter((x: any) => x.msg.getDestination().getName().startsWith(this.marketLiveDataTopicPrefix)))
      .subscribe(ev => {
        // Provide stats numbers
        this.iMdMsgNum++;
        this.iMdTotalBwUsage += ev.msg.getBinaryAttachment().length;
      });
  }

  public stopCalc() {
    clearTimeout(this.funcCalcCurrentStat);
    console.log('MsgRateCalc Service stopped.');
  }

  private calcCurrentStat() {
    const BW_1K = 1024;
    const BW_1M = BW_1K * 1024;
    const BW_1G = BW_1M * 1024;

    const iMsgNumInInterval = this.iMdMsgNum - this.iLastMsgReceivedNum;
    this.fMdMsgRate = (iMsgNumInInterval / this.MD_RATE_SAMPLING_INTERVAL) * 1000;

    // Since we used milliseconds, we should multiply this by 1000
    // updateGenericValue("DEVICE_MD_RATE", fMdMsgRate.toPrecision(5));
    this.iLastMsgReceivedNum = this.iMdMsgNum;
    // calculate bw usage.
    if (this.iMdTotalBwUsage > BW_1G) {
      this.fMdTotalBwUsage = this.iMdTotalBwUsage / BW_1G;
      this.sBwUnit = 'G';
    } else if (this.iMdTotalBwUsage > BW_1M) {
      this.fMdTotalBwUsage = this.iMdTotalBwUsage / BW_1M;
      this.sBwUnit = 'M';
    } else if (this.iMdTotalBwUsage > BW_1K) {
      this.fMdTotalBwUsage = this.iMdTotalBwUsage / BW_1K;
      this.sBwUnit = 'K';
    } // 1K
    this.nMdMsgRate.next(this.fMdMsgRate);
    this.strMdTotalBwUsage.next(this.fMdTotalBwUsage.toPrecision(5).toString() + this.sBwUnit);
    this.funcCalcCurrentStat = setTimeout(() => this.calcCurrentStat(), this.MD_RATE_SAMPLING_INTERVAL);
  }
}
