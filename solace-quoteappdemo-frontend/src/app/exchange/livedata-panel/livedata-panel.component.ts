import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { filter } from 'rxjs/operators';
import { StockSymbol } from '../../model/stock-symbol.model';
import { ListStockSymbolsService } from '../../list-stock-symbols.service';
import { LiveStockPriceService } from '../../live-stock-price.service';

@Component({
  selector: 'app-livedata-panel',
  templateUrl: './livedata-panel.component.html',
  styleUrls: ['./livedata-panel.component.css']
})
export class LivedataPanelComponent implements OnInit {
  public symbols: StockSymbol[];
  public mySymbols: Map<string, StockSymbol> = new Map<string, StockSymbol>();
  public btnStartCaption: string;
  public currentMsg: string;
  // public currMsgs: string[] = [];
  private marketLiveDataTopicPrefix = 'TW/TWSE/LIVE';
  private marketLiveDataTopic = this.marketLiveDataTopicPrefix + '/' + '*';
  public isReadyToSubscribe = false;

  TXT_CONNECTING = 'Connecting...';
  TXT_CONNECT = 'Connect';
  TXT_DISCONNECTING = 'Stopping...';
  TXT_DISCONNECT = 'Disconnect';
  TXT_REMIND_TO_SELECT = 'Please click on the symbol name to subscribe realtime data';


  constructor(private listStockSymbolsService: ListStockSymbolsService,
    private liveStockPriceSvc: LiveStockPriceService,
    private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.isReadyToSubscribe = false;
    this.listStockSymbolsService.getAvailableStocks().subscribe(
      data => {
        this.symbols = data;
        for (let i = 0; i < this.symbols.length; i++) {
          this.mySymbols.set(this.symbols[i].id, this.symbols[i]);
        }
        // console.log(this.mySymbols.get('2330').displayName);
      },
      err => console.error(err),
      () => console.log('All stock symbols are loaded.')
    );
    this.liveStockPriceSvc.svcStatus$.subscribe({
      next: (value) => {
        if (value === true) {
          console.log('Livedata Panel detects the connection to Solace, starting to fetch data...');
          this.initLiveDataPanel();
          // Subscribe livedata and define the message handler.
          this.liveStockPriceSvc.mySolclient.onMessage
            .pipe(filter((x: any) => x.msg.getDestination().getName().startsWith(this.marketLiveDataTopicPrefix)))
            .subscribe(ev => {
              this.updateSymbolData(ev.msg.getBinaryAttachment());
              // console.log('LiveData updated w/ ' + ev.msg.getBinaryAttachment());
            });
          // this.liveStockPriceSvc.subscribe(this.marketLiveDataTopic);
          this.isReadyToSubscribe = true;
          // console.log('Livedata Panel successfully subscribed data from Solace.');
        } else {
          if (this.isReadyToSubscribe) {
            // this.liveStockPriceSvc.unsubscribe(this.marketLiveDataTopic);
            this.isReadyToSubscribe = false;
            // 這裡也做一次是要避免按下停止接收行情後，畫面上顯示的古怪現象。
            this.initLiveDataPanel();
            console.log('Livedata Panel is terminated.');
          } else {
            console.log('Livedata Panel is waiting for connecting to Solace...');
          }
        }
      }
    });
  }

  private initLiveDataPanel() {
    for (let i = 0; i < this.symbols.length; i++) {
      this.symbols[i].isSubscribed = false;
    }
}

  public toggleSubscribeSymbol(iIndex: number) {
    if (this.liveStockPriceSvc.isConnected) {
      if (this.symbols[iIndex].isSubscribed) {
        this.liveStockPriceSvc.unsubscribe(this.marketLiveDataTopicPrefix + '/' + this.symbols[iIndex].id);
        this.symbols[iIndex].isSubscribed = false;
        console.log('Unsubscribed: ' + this.symbols[iIndex].id);
      } else {
        this.liveStockPriceSvc.subscribe(this.marketLiveDataTopicPrefix + '/' + this.symbols[iIndex].id);
        this.symbols[iIndex].isSubscribed = true;
        console.log('Subscribed: ' + this.symbols[iIndex].id);
      }
    }
  }

  private updateSymbolData(strMdRawData: string) {
    const arMdRawData = strMdRawData.split('|');

    if (this.mySymbols.get(arMdRawData[1]) !== null) {
      const currSymbol = this.mySymbols.get(arMdRawData[1]);
      currSymbol.vTotal = Number(arMdRawData[10]);
      currSymbol.pClose = Number(arMdRawData[7]);
      currSymbol.pDiff = Number(arMdRawData[8]);
      this.changeDetector.detectChanges();
    }
  }
}
