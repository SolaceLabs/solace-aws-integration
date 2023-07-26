import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import { ExchangeModule } from './exchange/exchange.module';
import { ListStockSymbolsService } from './list-stock-symbols.service';
import { LiveStockPriceService } from './live-stock-price.service';
import { MsgRateCalculatorService } from './msg-rate-calculator.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    UiModule,
    ExchangeModule
  ],
  providers: [ListStockSymbolsService, LiveStockPriceService, MsgRateCalculatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
