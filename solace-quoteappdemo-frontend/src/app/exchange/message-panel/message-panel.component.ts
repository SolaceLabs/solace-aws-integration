import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LiveStockPriceService } from '../../live-stock-price.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-message-panel',
  templateUrl: './message-panel.component.html',
  styleUrls: ['./message-panel.component.css']
})
export class MessagePanelComponent implements OnInit {
  public helloMsg: string;
  public exchangeMsgs: string[] = [];
  public msg: any;
  private currMsgPos: number;
  private marketStatusTopic = 'TW/TWSE/STATUS';
  private isSubscribed = false;

  private MAX_MSG_POS = 8;
  private TXT_READY_MSG = 'Preparing to receive SolEx messages...';
  private TXT_RUNNING_MSG = 'Live Stock Price Service is running...';


  constructor(private liveStockPriceSvc: LiveStockPriceService, private changeDetector: ChangeDetectorRef) {
    // Initialize exchangeMsgs
    for (let i = 0; i < this.MAX_MSG_POS; i++) {
      this.exchangeMsgs.push('.');
    }
    this.currMsgPos = 0;
  }

  ngOnInit() {
    this.liveStockPriceSvc.svcStatus$.subscribe({
      next: (value) => {
        if (value === true) {
          this.updateExchangeMsgs(this.TXT_RUNNING_MSG);
          // with filter
          this.liveStockPriceSvc.mySolclient.onMessage
            .pipe(filter((x: any) => x.msg.getDestination().getName().startsWith(this.marketStatusTopic)))
            .subscribe(ev => {
              this.updateExchangeMsgs(ev.msg.getBinaryAttachment());
              // console.log('MsgPanel updated w/ ' + ev.msg.getBinaryAttachment());
            });
          // without filter.
          /*
          this.liveStockPriceSvc.mySolclient.onMessage
          .subscribe(ev => {
            this.exchangeMsgs.push(ev.msg.getBinaryAttachment());
            console.log('From MsgPanel: ' + ev.msg.getBinaryAttachment());
          });
          */
          this.liveStockPriceSvc.subscribe(this.marketStatusTopic);
          this.isSubscribed = true;
        } else {
          if (this.isSubscribed) {
            // 代表已經在進行作業，所以要把訂閱解除
            // 不做訂閱解除是因為目前的設計中只要按下按鈕，就會切換Solace連接狀態，也會跟隨著做出解訂閱動作。
            // this.liveStockPriceSvc.unsubscribe(this.marketStatusTopic);
            this.isSubscribed = false;
            // clearTimeout(this.funcCalcCurrentStat);
            this.updateExchangeMsgs(this.TXT_READY_MSG);
            console.log('Message Panel is terminated.');
          } else {
            this.updateExchangeMsgs(this.TXT_READY_MSG);
            console.log('Message Panel is waiting for connecting to Solace...');
          }
        }
      }
    });
  }

  private updateExchangeMsgs(currMsg: string) {
    // 先把每一筆訊息向後移動，接著把新的訊息複製到第一個位置。
    for (let i = this.MAX_MSG_POS - 1; i > 0; i--) {
      this.exchangeMsgs[i] = this.exchangeMsgs[i - 1];
    }
    this.exchangeMsgs[0] = currMsg;
    // 讓View知道後面的array已經更新了。
    this.changeDetector.detectChanges();
  }
}
