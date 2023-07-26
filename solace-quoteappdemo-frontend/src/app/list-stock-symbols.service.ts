import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockSymbol } from './model/stock-symbol.model';
import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ListStockSymbolsService {

  constructor(private httpClient: HttpClient) {
  }

  getAvailableStocks(): Observable<StockSymbol[]> {
    return this.httpClient.get<StockSymbol[]>(environment.restBackend.uri);
  }
}
